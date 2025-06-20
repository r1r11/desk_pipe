import { Hono } from 'hono'

import { DeskPipeContext, Note, UserSession } from '../model'
import { createNote, deleteNote, listPublicNotes, readNote, updateNote } from '../model/db/notes'
import { getSession } from './middleware/auth';

export const notes = new Hono<DeskPipeContext>();

// Public routes
notes.get('', async (c) => {
    const result = await listPublicNotes(c.env.DB)

    if (result.error) {
        return c.json({ error: result.error }, 500)
    }

    if (!result.results || result.results.length === 0) {
        return c.json({ error: 'No public notes found' }, 404)
    }

    return c.json(result.results.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        is_public: note.is_public,
        created_at: note.created_at,
        updated_at: note.updated_at
    })))
})

notes.get(':id', async (c) => {
    const id = c.req.param('id');
    const note = await readNote(c.env.DB, id);

    if (!note) return c.json({ error: 'Not found' }, 404)
    
    return c.json(note)
})


// Apply auth middleware to *everything* below
notes.use('', async (c, next) => {
    const session = await getSession(c)
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    
    c.set('session', session);
    await next()
})

// Now only authenticated users can reach these:
notes.post('', async (c) => {
    const session = c.get('session') as UserSession;
    const body = await c.req.json()

    return c.json(await createNote(c.env.DB, body, session.userId))
})

notes.put(':id', async (c) => {
    const session = c.get('session') as UserSession;
    const id = c.req.param('id')
    const body = await c.req.json()

    return c.json(await updateNote(c.env.DB, id, body, session.userId))
})

notes.delete(':id', async (c) => {
    const session = c.get('session') as UserSession;
    const id = c.req.param('id')

    return c.json(await deleteNote(c.env.DB, id, session.userId))
})
