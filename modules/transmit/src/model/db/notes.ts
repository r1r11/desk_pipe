export function listPublicNotes(db: D1Database) {
    return db.prepare('SELECT * FROM notes WHERE is_public = 1').all();
}

export function readNote(db: D1Database, id: string) {
    return db.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();
}

export function createNote(db: D1Database, body: any, userId: string) {
    const { title, content, is_public } = body;
    
    return db.prepare('INSERT INTO notes (title, content, is_public, user_id) VALUES (?, ?, ?, ?)')
        .bind(title, content, is_public ? 1 : 0, userId)
        .run();
}

export function updateNote(db: D1Database, id: string, body: any, userId: string) {
    const { title, content, is_public } = body;
    
    return db.prepare('UPDATE notes SET title = ?, content = ?, is_public = ? WHERE id = ? AND user_id = ?')
        .bind(title, content, is_public ? 1 : 0, id, userId)
        .run();
}

export function deleteNote(db: D1Database, id: string, userId: string) {
    return db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?')
        .bind(id, userId)
        .run();
}
