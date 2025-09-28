import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { config } from '../config';

const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🚀 Starting database initialization...');
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`🔗 Connecting to: ${config.database.host}:${config.database.port}/${config.database.database}`);
    
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    
    // Verificar la conexión
    await AppDataSource.query('SELECT 1');
    console.log('✅ Database health check passed');
    
    // Mostrar información de las tablas
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Available tables:');
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`);
    });
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;
