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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorshipGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let MentorshipGateway = class MentorshipGateway {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, name: true, email: true, role: true },
            });
            if (!user) {
                client.disconnect();
                return;
            }
            client.data.user = user;
            console.log(`User ${user.name} connected to WebSocket`);
        }
        catch (error) {
            console.error('WebSocket connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.data.user) {
            console.log(`User ${client.data.user.name} disconnected from WebSocket`);
        }
    }
    async handleJoinRoom(client, data) {
        const { roomId } = data;
        const user = client.data.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        const session = await this.prisma.session.findUnique({
            where: { roomId },
            select: { mentorId: true, studentId: true, status: true },
        });
        if (!session || (session.mentorId !== user.id && session.studentId !== user.id)) {
            return { error: 'Access denied to this room' };
        }
        client.join(roomId);
        client.to(roomId).emit('user-joined', { userId: user.id, userName: user.name });
        return { success: true, roomId, userId: user.id };
    }
    async handleLeaveRoom(client, data) {
        const { roomId } = data;
        const user = client.data.user;
        if (!user)
            return { error: 'Unauthorized' };
        client.leave(roomId);
        client.to(roomId).emit('user-left', { userId: user.id, userName: user.name });
        return { success: true };
    }
    async handleWebRTCOffer(client, data) {
        const { roomId, offer, targetUserId } = data;
        const user = client.data.user;
        if (!user)
            return { error: 'Unauthorized' };
        client.to(roomId).emit('webrtc-offer', {
            offer,
            fromUserId: user.id,
            fromUserName: user.name,
        });
        return { success: true };
    }
    async handleWebRTCAnswer(client, data) {
        const { roomId, answer, targetUserId } = data;
        const user = client.data.user;
        if (!user)
            return { error: 'Unauthorized' };
        client.to(roomId).emit('webrtc-answer', {
            answer,
            fromUserId: user.id,
            fromUserName: user.name,
        });
        return { success: true };
    }
    async handleWebRTCIceCandidate(client, data) {
        const { roomId, candidate, targetUserId } = data;
        const user = client.data.user;
        if (!user)
            return { error: 'Unauthorized' };
        client.to(roomId).emit('webrtc-ice-candidate', {
            candidate,
            fromUserId: user.id,
            fromUserName: user.name,
        });
        return { success: true };
    }
    async handleChatMessage(client, data) {
        const { roomId, message } = data;
        const user = client.data.user;
        if (!user)
            return { error: 'Unauthorized' };
        client.to(roomId).emit('chat-message', {
            message,
            fromUserId: user.id,
            fromUserName: user.name,
            timestamp: new Date().toISOString(),
        });
        return { success: true };
    }
};
exports.MentorshipGateway = MentorshipGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MentorshipGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MentorshipGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MentorshipGateway.prototype, "handleWebRTCOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MentorshipGateway.prototype, "handleWebRTCAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-ice-candidate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MentorshipGateway.prototype, "handleWebRTCIceCandidate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MentorshipGateway.prototype, "handleChatMessage", null);
exports.MentorshipGateway = MentorshipGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], MentorshipGateway);
//# sourceMappingURL=mentorship.gateway.js.map