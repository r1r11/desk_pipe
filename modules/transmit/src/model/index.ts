export interface Env {
    // authentication
    AUTH_SECRET: string
    AUTH_GITHUB_ID: string
    AUTH_GITHUB_SECRET: string
    AUTH_GOOGLE_ID: string
    AUTH_GOOGLE_SECRET: string
    AUTH_APPLE_ID: string
    AUTH_APPLE_SECRET: string
    // storage devices
    DB: D1Database,
}

export interface User {
    id: string
    email: string
}

export interface UserSession {
    userId: string
    sessionId: string
    expiresAt: Date
}

export interface DeskPipeContext {
    Bindings: Env,
    Variables: {
        auth: Response,
        user: User | null,
        session: UserSession | null
        diagnostic_info: string
    }
}