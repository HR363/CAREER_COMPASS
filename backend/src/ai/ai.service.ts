import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { CareerRecommendationDto } from './dto/career-recommendation.dto';
import { LearningPathDto } from './dto/learning-path.dto';

@Injectable()
export class AiService {
  // ✅ Use gemini-flash-latest which acts as a stable alias for the currently available Flash model
  private readonly geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
  private readonly apiKey = process.env.GEMINI_API_KEY;

  constructor(private prisma: PrismaService) {}

  async generateCareerRecommendations(dto: CareerRecommendationDto, userId: string) {
    try {
      const prompt = this.buildCareerRecommendationPrompt(dto);
      const response = await this.callGeminiAPI(prompt);

      const recommendations = {
        suggestedCareers: response,
        learningPath: null,
      };

      await this.prisma.recommendation.create({
        data: {
          userId,
          suggestedCareers: JSON.stringify(response),
        },
      });

      return recommendations;
    } catch (error) {
      console.error('Error generating career recommendations:', error);
      throw new Error('Failed to generate career recommendations');
    }
  }

  async generateLearningPath(dto: LearningPathDto, userId: string) {
    try {
      const prompt = this.buildLearningPathPrompt(dto);
      const response = await this.callGeminiAPI(prompt);

      const learningPath = {
        careerPath: dto.careerPath,
        learningPath: response,
      };

      const existingRecommendation = await this.prisma.recommendation.findFirst({
        where: { userId },
      });

      if (existingRecommendation) {
        await this.prisma.recommendation.update({
          where: { id: existingRecommendation.id },
          data: {
            learningPath: JSON.stringify(response),
          },
        });
      } else {
        await this.prisma.recommendation.create({
          data: {
            userId,
            learningPath: JSON.stringify(response),
          },
        });
      }

      return learningPath;
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw new Error('Failed to generate learning path');
    }
  }

  async getMentorRecommendations(userId: string) {
    try {
      // 1. Get Student Profile
      const studentProfile = await this.prisma.profile.findUnique({
        where: { userId },
        include: { user: true },
      });

      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      // 2. Get All Mentors
      const mentors = await this.prisma.user.findMany({
        where: { role: 'MENTOR' },
        include: { profile: true },
        take: 50, // Limit to avoid context overflow
      });

      if (mentors.length === 0) {
        return [];
      }

      // 3. Build Prompt
      const prompt = this.buildMentorMatchingPrompt(studentProfile, mentors);

      // 4. Call AI
      const response = await this.callGeminiAPI(prompt);

      // 5. Map response to actual mentor objects
      const recommendations = Array.isArray(response) ? response : [];
      
      const enrichedRecommendations = recommendations.map((rec: any) => {
        const mentor = mentors.find(m => m.id === rec.mentorId);
        return {
          ...rec,
          mentorName: mentor ? mentor.name : 'Unknown Mentor',
          mentorEmail: mentor ? mentor.email : '',
          mentorId: mentor ? mentor.id : rec.mentorId,
        };
      });

      return enrichedRecommendations;

    } catch (error) {
      console.error('Error generating mentor recommendations:', error);
      throw new Error('Failed to generate mentor recommendations');
    }
  }

  async chatWithAI(message: string, context?: any) {
    try {
      const prompt = this.buildChatPrompt(message, context);
      const response = await this.callGeminiAPI(prompt);
      return { response };
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to process chat message');
    }
  }

  private buildCareerRecommendationPrompt(dto: CareerRecommendationDto): string {
    return `Given this student's profile:
- Skills: ${dto.skills}
- Interests: ${dto.interests}
- Education: ${dto.education || 'Not specified'}
- Goals: ${dto.goals || 'Not specified'}

Please suggest 3 specific career paths that would be suitable for this student. For each career path, provide:
1. Job title
2. Brief description (2-3 sentences)
3. Required skills and qualifications
4. Average salary range
5. Growth prospects
6. Why this career matches their profile

Format your response as a JSON array with objects containing: title, description, requiredSkills, salaryRange, growthProspects, and matchReason.`;
  }

  private buildLearningPathPrompt(dto: LearningPathDto): string {
    return `Create a detailed learning roadmap for someone who wants to pursue a career in: ${dto.careerPath}

Current skills: ${dto.currentSkills}
Timeframe: ${dto.timeframe || '6-12 months'}

Please provide:
1. Phase-by-phase learning plan
2. Specific courses, certifications, or resources for each phase
3. Timeline for each phase
4. Skills to focus on in each phase
5. Practical projects or exercises
6. Key milestones and checkpoints

Format as a JSON object with phases array, where each phase contains: name, duration, skills, resources, projects, and milestones.`;
  }

  private buildMentorMatchingPrompt(studentProfile: any, mentors: any[]): string {
    const studentContext = {
      name: studentProfile.user.name,
      skills: studentProfile.skills,
      interests: studentProfile.interests,
      goals: studentProfile.goals,
      education: studentProfile.education
    };

    const mentorsList = mentors.map(m => ({
      id: m.id,
      name: m.name,
      skills: m.profile?.skills || 'Not specified',
      interests: m.profile?.interests || 'Not specified',
      education: m.profile?.education || 'Not specified',
    }));

    return `System: You are an expert implementation of a mentorship matching algorithm.
    
    Task: Select specific suitable mentors for the student based on profile compatibility.
    
    Student Profile:
    ${JSON.stringify(studentContext)}
    
    Available Mentors:
    ${JSON.stringify(mentorsList)}
    
    Instructions:
    1. Analyze the student's skills, interests, and goals.
    2. Compare with each mentor's profile (skills, interests, education).
    3. Select top 3-5 matches. If fewer are good matches, return fewer.
    4. Provide a match score (0-100) and a reasoning for each.
    
    Output Format (JSON Array):
    [
      {
        "mentorId": "string (must match input id)",
        "matchScore": number,
        "reasoning": "string"
      }
    ]
    `;
  }

  private buildChatPrompt(message: string, context?: any): string {
    let prompt = `You are CareerCompass AI, an expert career guidance assistant. You help students and professionals with career advice, job search tips, skill development, and professional growth.

User message: ${message}`;

    if (context) {
      prompt += `\n\nUser context: ${JSON.stringify(context)}`;
    }

    prompt += `\n\nPlease provide helpful, specific, and actionable advice. Keep your response conversational but professional.`;

    return prompt;
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      let content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

      // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
      if (content && typeof content === 'string') {
        content = content.trim();
        // Remove opening code fence with optional language identifier
        content = content.replace(/^```(?:json)?\s*\n?/i, '');
        // Remove closing code fence
        content = content.replace(/\n?```\s*$/i, '');
        content = content.trim();
      }

      try {
        return JSON.parse(content);
      } catch {
        // If parsing fails, return a structured error object instead of raw string
        console.warn('Failed to parse AI response as JSON:', content?.substring(0, 200));
        return content;
      }
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error('Failed to communicate with AI service');
    }
  }
}
