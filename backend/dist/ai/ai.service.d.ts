import { PrismaService } from '../prisma/prisma.service';
import { CareerRecommendationDto } from './dto/career-recommendation.dto';
import { LearningPathDto } from './dto/learning-path.dto';
export declare class AiService {
    private prisma;
    private readonly geminiApiUrl;
    private readonly apiKey;
    constructor(prisma: PrismaService);
    generateCareerRecommendations(dto: CareerRecommendationDto, userId: string): Promise<{
        suggestedCareers: any;
        learningPath: any;
    }>;
    generateLearningPath(dto: LearningPathDto, userId: string): Promise<{
        careerPath: string;
        learningPath: any;
    }>;
    chatWithAI(message: string, context?: any): Promise<{
        response: any;
    }>;
    private buildCareerRecommendationPrompt;
    private buildLearningPathPrompt;
    private buildChatPrompt;
    private callGeminiAPI;
}
