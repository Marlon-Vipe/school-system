import 'reflect-metadata';
import { AppDataSource } from '../../config/database';
import { PaymentService } from './payment.service';
import { PaymentMethod } from './payment.entity';
import { StudentService } from '../students/student.service';

const seedPayments = async (): Promise<void> => {
  try {
    console.log('🌱 Starting payment seeding...');

    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const paymentService = new PaymentService();
    const studentService = new StudentService();

    // Get all students to create payments for them
    const students = await studentService.getAllStudents();
    
    if (students.length === 0) {
      console.log('❌ No students found. Please seed students first.');
      return;
    }

    console.log(`📚 Found ${students.length} students`);

    // Sample payment data
    const paymentData = [
      {
        amount: 150.00,
        method: PaymentMethod.CASH,
        description: 'Matrícula mensual - Enero 2024',
        reference: 'MAT-2024-001',
      },
      {
        amount: 75.50,
        method: PaymentMethod.CARD,
        description: 'Materiales de estudio',
        reference: 'MAT-2024-002',
      },
      {
        amount: 200.00,
        method: PaymentMethod.TRANSFER,
        description: 'Curso de inglés avanzado',
        reference: 'CUR-2024-001',
      },
      {
        amount: 120.00,
        method: PaymentMethod.CHECK,
        description: 'Actividades extracurriculares',
        reference: 'ACT-2024-001',
      },
      {
        amount: 85.00,
        method: PaymentMethod.CASH,
        description: 'Examen de certificación',
        reference: 'EXA-2024-001',
      },
    ];

    let createdPayments = 0;

    // Create payments for each student
    for (const student of students) {
      // Create 2-4 payments per student
      const numPayments = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numPayments; i++) {
        const paymentTemplate = paymentData[Math.floor(Math.random() * paymentData.length)];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1); // Due in 1-30 days

        try {
          await paymentService.createPayment({
            studentId: student.id,
            amount: paymentTemplate.amount + (Math.random() * 50 - 25), // Add some variation
            method: paymentTemplate.method,
            description: paymentTemplate.description,
            dueDate: dueDate,
            reference: `${paymentTemplate.reference}-${student.id.slice(-4)}`,
          });
          
          createdPayments++;
        } catch (error) {
          console.error(`❌ Error creating payment for student ${student.name}:`, error);
        }
      }
    }

    console.log(`✅ Created ${createdPayments} payments successfully`);
    console.log('🎉 Payment seeding completed!');

  } catch (error) {
    console.error('❌ Error during payment seeding:', error);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedPayments()
    .then(() => {
      console.log('✅ Payment seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Payment seeding failed:', error);
      process.exit(1);
    });
}

export { seedPayments };
