import { getCookie } from 'hono/cookie';
import type { Context } from 'hono';
import type { DeskPipeContext, User } from '../../model';

export async function getUserFromSession(c: Context<DeskPipeContext>): Promise<User | null> {
    const token = getCookie(c, 'next-auth.session-token');
    if (!token) return null;

    const sessionRow = await c.env.DB
        .prepare('SELECT userId, expires FROM sessions WHERE sessionToken = ?')
        .bind(token)
        .first<{ userId: string; expires: string }>();

    if (!sessionRow || new Date(sessionRow.expires) < new Date()) return null;

    const userRow = await c.env.DB
        .prepare('SELECT id, email, name, image FROM users WHERE id = ?')
        .bind(sessionRow.userId)
        .first<User>();

    return userRow ?? null;
}