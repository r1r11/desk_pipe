-- migrations/001_auth.sql
CREATE TABLE
    IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        emailVerified INTEGER,
        image TEXT
    );

CREATE TABLE
    IF NOT EXISTS accounts (
        userId TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        providerAccountId TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        PRIMARY KEY (provider, providerAccountId),
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS sessions (
        sessionToken TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        expires INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires INTEGER NOT NULL,
        PRIMARY KEY (identifier, token)
    );