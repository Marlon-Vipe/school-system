import { AppDataSource } from '../src/config/database';

async function initializeCashModule() {
  try {
    console.log('🔄 Initializing cash module...');
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
    
    // Create cash_entries table using raw SQL
    console.log('🔄 Creating cash_entries table...');
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS cash_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        category VARCHAR(50) NOT NULL CHECK (category IN (
          'tuition_payment', 'enrollment_fee', 'material_fee', 'other_income',
          'salaries', 'utilities', 'maintenance', 'supplies', 'marketing', 'other_expense'
        )),
        amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
        description VARCHAR(255) NOT NULL,
        reference VARCHAR(100),
        notes TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        transaction_date DATE NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
        receipt_number VARCHAR(255),
        attachments TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Cash entries table created successfully');
    
    // Create indexes (using the actual column names from TypeORM)
    await AppDataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_cash_entries_type ON cash_entries(type);
      CREATE INDEX IF NOT EXISTS idx_cash_entries_category ON cash_entries(category);
      CREATE INDEX IF NOT EXISTS idx_cash_entries_status ON cash_entries(status);
      CREATE INDEX IF NOT EXISTS idx_cash_entries_transaction_date ON cash_entries("transactionDate");
      CREATE INDEX IF NOT EXISTS idx_cash_entries_user_id ON cash_entries("userId");
    `);
    console.log('✅ Indexes created successfully');
    
    // Insert demo user if not exists
    const demoUserExists = await AppDataSource.query(
      'SELECT id FROM users WHERE id = $1',
      ['00000000-0000-0000-0000-000000000001']
    );
    
    if (demoUserExists.length === 0) {
      console.log('🔄 Creating demo user...');
      await AppDataSource.query(`
        INSERT INTO users (id, name, "lastName", email, password, role, status, "createdAt", "updatedAt")
        VALUES (
          '00000000-0000-0000-0000-000000000001',
          'Demo',
          'User',
          'demo@vipeschool.com',
          '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2',
          'admin',
          'active',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Demo user created successfully');
    } else {
      console.log('✅ Demo user already exists');
    }
    
    // Insert sample cash entries
    const cashEntriesCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM cash_entries'
    );
    
    if (parseInt(cashEntriesCount[0].count) === 0) {
      console.log('🔄 Creating sample cash entries...');
      await AppDataSource.query(`
        INSERT INTO cash_entries (id, type, category, amount, description, "transactionDate", "userId", status, "createdAt", "updatedAt")
        VALUES 
          (gen_random_uuid(), 'income', 'tuition_payment', 500000, 'Pago de matrícula - Estudiante Juan Pérez', CURRENT_DATE, '00000000-0000-0000-0000-000000000001', 'confirmed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          (gen_random_uuid(), 'income', 'enrollment_fee', 100000, 'Cuota de inscripción - María García', CURRENT_DATE, '00000000-0000-0000-0000-000000000001', 'confirmed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          (gen_random_uuid(), 'expense', 'salaries', 2000000, 'Pago de salarios - Personal docente', CURRENT_DATE, '00000000-0000-0000-0000-000000000001', 'confirmed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          (gen_random_uuid(), 'expense', 'utilities', 300000, 'Servicios públicos - Electricidad', CURRENT_DATE, '00000000-0000-0000-0000-000000000001', 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          (gen_random_uuid(), 'income', 'material_fee', 75000, 'Cuota de materiales - Curso de Matemáticas', CURRENT_DATE - INTERVAL '1 day', '00000000-0000-0000-0000-000000000001', 'confirmed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          (gen_random_uuid(), 'expense', 'maintenance', 150000, 'Mantenimiento de equipos de cómputo', CURRENT_DATE - INTERVAL '2 days', '00000000-0000-0000-0000-000000000001', 'confirmed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      console.log('✅ Sample cash entries created successfully');
    } else {
      console.log('✅ Sample cash entries already exist');
    }
    
    console.log('🎉 Cash module initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing cash module:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run the initialization
initializeCashModule()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });