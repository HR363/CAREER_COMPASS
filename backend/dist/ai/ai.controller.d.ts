import { AiService } from './ai.service';
import { CareerRecommendationDto } from './dto/career-recommendation.dto';
import { LearningPathDto } from './dto/learning-path.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    recommendCareer(careerRecommendationDto: CareerRecommendationDto, user: any): Promise<{
        suggestedCareers: any;
        learningPath: any;
    }>;
    generateLearningPath(learningPathDto: LearningPathDto, user: any): Promise<{
        careerPath: string;
        learningPath: any;
    }>;
    chatWithAI(body: {
        message: string;
        context?: any;
    }, user: any): Promise<{
        response: any;
    }>;
}
