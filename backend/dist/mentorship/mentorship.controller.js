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
exports.MentorshipController = void 0;
const common_1 = require("@nestjs/common");
const mentorship_service_1 = require("./mentorship.service");
const schedule_session_dto_1 = require("./dto/schedule-session.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let MentorshipController = class MentorshipController {
    constructor(mentorshipService) {
        this.mentorshipService = mentorshipService;
    }
    async scheduleSession(scheduleSessionDto, user) {
        return this.mentorshipService.scheduleSession(scheduleSessionDto);
    }
    async getSessions(user) {
        return this.mentorshipService.getSessions(user.id, user.role);
    }
    async getSession(sessionId, user) {
        return this.mentorshipService.getSession(sessionId, user.id, user.role);
    }
    async joinSession(sessionId, user) {
        return this.mentorshipService.joinSession(sessionId, user.id);
    }
    async endSession(sessionId, user) {
        return this.mentorshipService.endSession(sessionId, user.id, user.role);
    }
    async cancelSession(sessionId, user) {
        return this.mentorshipService.cancelSession(sessionId, user.id, user.role);
    }
};
exports.MentorshipController = MentorshipController;
__decorate([
    (0, common_1.Post)('schedule'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_session_dto_1.ScheduleSessionDto, Object]),
    __metadata("design:returntype", Promise)
], MentorshipController.prototype, "scheduleSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MentorshipController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MentorshipController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('sessions/:id/join'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MentorshipController.prototype, "joinSession", null);
__decorate([
    (0, common_1.Put)('sessions/:id/end'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MentorshipController.prototype, "endSession", null);
__decorate([
    (0, common_1.Put)('sessions/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MentorshipController.prototype, "cancelSession", null);
exports.MentorshipController = MentorshipController = __decorate([
    (0, common_1.Controller)('mentorship'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [mentorship_service_1.MentorshipService])
], MentorshipController);
//# sourceMappingURL=mentorship.controller.js.map