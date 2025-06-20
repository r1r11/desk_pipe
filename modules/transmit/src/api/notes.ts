import { Hono } from 'hono'

import { DeskPipeContext, UserSession } from '../model'
import { createNote, deleteNote, listPublicNotes, readNote, updateNote } from '../model/db/notes'
import { getSession } from './middleware/auth';

export const notes = new Hono<DeskPipeContext>();

// Public routes
notes.get('/api/notes', async (c) => {
    return c.json(await listPublicNotes(c.env.DB))
})

notes.get('/api/notes/:id', async (c) => {
    const id = c.req.param('id');
    const note = await readNote(c.env.DB, id);

    if (!note) return c.json({ error: 'Not found' }, 404)
    
    return c.json(note)
})


// Apply auth middleware to *everything* below
notes.use('/api/notes', async (c, next) => {
    const session = await getSession(c)
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    
    c.set('session', session);
    await next()
})

// Now only authenticated users can reach these:
notes.post('/api/notes', async (c) => {
    const session = c.get('session') as UserSession;
    const body = await c.req.json()

    return c.json(await createNote(c.env.DB, body, session.userId))
})

notes.put('/api/notes/:id', async (c) => {
    const session = c.get('session') as UserSession;
    const id = c.req.param('id')
    const body = await c.req.json()

    return c.json(await updateNote(c.env.DB, id, body, session.userId))
})

notes.delete('/api/notes/:id', async (c) => {
    const session = c.get('session') as UserSession;
    const id = c.req.param('id')

    return c.json(await deleteNote(c.env.DB, id, session.userId))
})
