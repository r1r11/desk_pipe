import { Context } from 'hono'
import { getCookie } from 'hono/cookie';

import { DeskPipeContext, UserSession } from '../../model'

export async function getSession(c: Context<DeskPipeContext>): Promise<UserSession | null> {
    const sessionId = getCookie(c, 'session_id')
    
    if (!sessionId) return null

    const row = await c.env.DB
            .prepare(`SELECT user_id, expires_at FROM sessions WHERE id = ?`)
            .bind(sessionId).first()

    if (!row) return null

    const expiresAt = new Date((row as {expires_at: string}).expires_at)
    if (expiresAt < new Date()) {
        // optional: cleanup expired session
        await c.env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(sessionId).run()
        return null
    }

    return {
        sessionId,
        userId: (row.user_id as string),
        expiresAt
    }
}