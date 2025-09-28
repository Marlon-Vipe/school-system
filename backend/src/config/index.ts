import * as dotenv from 'dotenv';

// Load environment variables from multiple sources
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

// Debug: Log CORS origin
console.log('CORS_ORIGIN from env:', process.env.CORS_ORIGIN);

export const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'vipe_school_db',
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

export default config;
