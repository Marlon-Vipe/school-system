import { DataSource } from 'typeorm';
import { config } from './index';
import { Student } from '../modules/students/student.entity';
import { User } from '../modules/auth/user.entity';
import { Course } from '../modules/courses/course.entity';
import { Enrollment } from '../modules/enrollments/enrollment.entity';
import { Payment } from '../modules/payments/payment.entity';
import { CashEntry } from '../modules/cash/cash-entry.entity';
import { Purchase } from '../modules/purchases/purchase.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.nodeEnv === 'development',
  logging: config.nodeEnv === 'development',
  entities: [
    Student,
    User,
    Course,
    Enrollment,
    Payment,
    CashEntry,
    Purchase,
  ],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  // Configuración adicional para mejorar la conexión
  extra: {
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
  },
  // Configuración de SSL para producción
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Verificar si ya está inicializada
    if (AppDataSource.isInitialized) {
      console.log('✅ Database already connected');
      return;
    }

    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    console.log(`📊 Connected to: ${config.database.host}:${config.database.port}/${config.database.database}`);
    
    // Verificar la conexión
    await AppDataSource.query('SELECT 1');
    console.log('✅ Database health check passed');
    
  } catch (error) {
    console.error('❌ Error during Data Source initialization:', error);
    
    // Información adicional para debugging
    console.error('🔍 Database configuration:');
    console.error(`   Host: ${config.database.host}`);
    console.error(`   Port: ${config.database.port}`);
    console.error(`   Database: ${config.database.database}`);
    console.error(`   Username: ${config.database.username}`);
    
    throw error;
  }
};

export default AppDataSource;



