export declare const USER_ROLES: {
    readonly ADMIN: "ADMIN";
    readonly MENTOR: "MENTOR";
    readonly STUDENT: "STUDENT";
};
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export declare const SESSION_STATUS: {
    readonly SCHEDULED: "SCHEDULED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
