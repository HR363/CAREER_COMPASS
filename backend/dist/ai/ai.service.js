"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const prisma_service_1 = require("../prisma/prisma.service");
let AiService = class AiService {
    constructor(prisma) {
        this.prisma = prisma;
        this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.apiKey = process.env.GEMINI_API_KEY;
    }
    async generateCareerRecommendations(dto, userId) {
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
        }
        catch (error) {
            console.error('Error generating career recommendations:', error);
            throw new Error('Failed to generate career recommendations');
        }
    }
    async generateLearningPath(dto, userId) {
        try {
            const prompt = this.buildLearningPathPrompt(dto);
            const response = await this.callGeminiAPI(prompt);
            const learningPath = {
                careerPath: dto.careerPath,
                learningPath: response,
            };
            await this.prisma.recommendation.upsert({
                where: { userId },
                update: {
                    learningPath: JSON.stringify(response),
                },
                create: {
                    userId,
                    learningPath: JSON.stringify(response),
                },
            });
            return learningPath;
        }
        catch (error) {
            console.error('Error generating learning path:', error);
            throw new Error('Failed to generate learning path');
        }
    }
    async chatWithAI(message, context) {
        try {
            const prompt = this.buildChatPrompt(message, context);
            const response = await this.callGeminiAPI(prompt);
            return { response };
        }
        catch (error) {
            console.error('Error in AI chat:', error);
            throw new Error('Failed to process chat message');
        }
    }
    buildCareerRecommendationPrompt(dto) {
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
    buildLearningPathPrompt(dto) {
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
    buildChatPrompt(message, context) {
        let prompt = `You are CareerCompass AI, an expert career guidance assistant. You help students and professionals with career advice, job search tips, skill development, and professional growth.

User message: ${message}`;
        if (context) {
            prompt += `\n\nUser context: ${JSON.stringify(context)}`;
        }
        prompt += `\n\nPlease provide helpful, specific, and actionable advice. Keep your response conversational but professional.`;
        return prompt;
    }
    async callGeminiAPI(prompt) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }
        try {
            const response = await axios_1.default.post(`${this.geminiApiUrl}?key=${this.apiKey}`, {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const content = response.data.candidates[0].content.parts[0].text;
            try {
                return JSON.parse(content);
            }
            catch {
                return content;
            }
        }
        catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new Error('Failed to communicate with AI service');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map