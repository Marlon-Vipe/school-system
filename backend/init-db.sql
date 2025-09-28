-- Initialize database with basic setup
-- This file is executed when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a basic admin user (password: admin123)
-- Note: In production, this should be done through the API
INSERT INTO users (id, name, "lastName", email, password, role, status, "createdAt", "updatedAt")
VALUES (
  uuid_generate_v4(),
  'Admin',
  'User',
  'admin@vipeschool.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeHdKz8Kz8Kz8Kz8K', -- admin123
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;



