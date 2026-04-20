DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS glossary;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS benefits;
DROP TABLE IF EXISTS users;

CREATE TABLE benefits (
    benefits_id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,
    category JSONB,
    urls JSONB UNIQUE NOT NULL,
    details JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE faqs (
    faqs_id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    benefit_slug VARCHAR(100) REFERENCES benefits(slug),
    category JSONB,
    display_order INTEGER DEFAULT 999,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE glossary (
    glossary_id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    term VARCHAR(100) UNIQUE NOT NULL,
    definition TEXT NOT NULL,
    related_benefits JSONB,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversations (
    conversation_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255), -- e.g., "Universal Credit Discovery"
    summary TEXT, -- To store the AI-generated summary for the user
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    sender VARCHAR(20) CHECK (sender IN ('user', 'ai')),
    content TEXT NOT NULL,
    metadata JSONB, -- Stores things like suggested benefit slug or question_id
    created_at TIMESTAMP DEFAULT NOW()
);
