import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../modules/auth/user.entity';
import bcrypt from 'bcryptjs';

const createAdminUser = async (): Promise<void> => {
  try {
    console.log('🚀 Creating admin user...');
    
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@vipeschool.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User();
    adminUser.name = 'Admin';
    adminUser.lastName = 'User';
    adminUser.email = 'admin@vipeschool.com';
    adminUser.password = 'admin123';
    adminUser.role = UserRole.ADMIN;
    adminUser.status = UserStatus.ACTIVE;

    // Hash password
    adminUser.password = await bcrypt.hash(adminUser.password, 12);

    await userRepository.save(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@vipeschool.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
};

// Execute if called directly
if (require.main === module) {
  createAdminUser();
}

export default createAdminUser;
