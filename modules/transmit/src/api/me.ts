import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import type { DeskPipeContext } from '../model';
import { getUserFromSession } from './utils/auth';

export const me_api = new Hono<DeskPipeContext>();

me_api.get('/', async (c) => {
    const userRow = getUserFromSession(c);

    if (!userRow) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const user = await userRow;
    if (!user) {
        return c.json({ error: 'User not found' }, 404);
    }
    return c.json({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image       
    });
});