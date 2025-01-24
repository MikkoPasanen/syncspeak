DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

-- Table for users (passwords hashed)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP
);

-- One-to-Many relationship table for chat messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMP
);