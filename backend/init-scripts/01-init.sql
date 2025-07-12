-- Database initialization script

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance (these will be created by Hibernate as well)
-- But having them here ensures they exist from the start

-- Note: Hibernate will create the tables based on your entities
-- This script is mainly for any custom setup, indexes, or initial data

-- Example: Create a function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- You can add any initial data here if needed
-- Example:
-- INSERT INTO blog_posts (title, content, author, status, created_at, updated_at) 
-- VALUES ('Welcome Post', 'Welcome to our blog!', 'Admin', 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
-- ON CONFLICT DO NOTHING;