import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class MentorshipGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
    }): Promise<{
        error: string;
        success?: undefined;
        roomId?: undefined;
        userId?: undefined;
    } | {
        success: boolean;
        roomId: string;
        userId: any;
        error?: undefined;
    }>;
    handleLeaveRoom(client: Socket, data: {
        roomId: string;
    }): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleWebRTCOffer(client: Socket, data: {
        roomId: string;
        offer: any;
        targetUserId: string;
    }): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleWebRTCAnswer(client: Socket, data: {
        roomId: string;
        answer: any;
        targetUserId: string;
    }): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleWebRTCIceCandidate(client: Socket, data: {
        roomId: string;
        candidate: any;
        targetUserId: string;
    }): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleChatMessage(client: Socket, data: {
        roomId: string;
        message: string;
    }): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
}
