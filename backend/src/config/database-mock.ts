// Mock database configuration for development without PostgreSQL
export const initializeDatabase = async (): Promise<void> => {
  console.log('⚠️  Running in MOCK mode - No database connection');
  console.log('📝 To use real database, install PostgreSQL or Docker');
  return Promise.resolve();
};

export default {
  initialize: () => Promise.resolve(),
  getRepository: () => {
    throw new Error('Mock database - Repository not available');
  }
};



