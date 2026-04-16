DROP TABLE IF EXISTS glossary
DROP TABLE IF EXISTS faqs
DROP TABLE IF EXISTS benefits

CREATE TABLE benefits (
    benefits_id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    urls JSONB UNIQUE NOt NULL,
    details JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE faqs (
    faqs_id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    benefit_slug VARCHAR(100) REFERENCES benefits(slug),
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE glossary (
    glossary_id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    term VARCHAR(255) UNIQUE NOT NULL,
    definition TEXT NOT NULL,
    related_benefits JSONB,
    active BOOLEAN DEFAULT TRUE
);