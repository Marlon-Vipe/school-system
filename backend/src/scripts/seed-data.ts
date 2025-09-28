import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Student, StudentStatus } from '../modules/students/student.entity';
import { Course, CourseStatus } from '../modules/courses/course.entity';
import { Payment, PaymentStatus, PaymentMethod } from '../modules/payments/payment.entity';

async function seedData() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const studentRepository = AppDataSource.getRepository(Student);
    const courseRepository = AppDataSource.getRepository(Course);
    const paymentRepository = AppDataSource.getRepository(Payment);

    // Clear existing data (delete all records)
    await paymentRepository.createQueryBuilder().delete().execute();
    await studentRepository.createQueryBuilder().delete().execute();
    await courseRepository.createQueryBuilder().delete().execute();
    console.log('🗑️ Cleared existing data');

    // Create students
    const students = [
      {
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+1 234 567 8900',
        address: 'Calle Principal 123, Ciudad',
        dateOfBirth: new Date('1995-05-15'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'María',
        lastName: 'García',
        email: 'maria.garcia@example.com',
        phone: '+1 234 567 8901',
        address: 'Avenida Central 456, Ciudad',
        dateOfBirth: new Date('1998-08-22'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@example.com',
        phone: '+1 234 567 8902',
        address: 'Plaza Mayor 789, Ciudad',
        dateOfBirth: new Date('1996-12-10'),
        status: StudentStatus.INACTIVE
      },
      {
        name: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@example.com',
        phone: '+1 234 567 8903',
        address: 'Calle Secundaria 321, Ciudad',
        dateOfBirth: new Date('1997-03-18'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Luis',
        lastName: 'Rodríguez',
        email: 'luis.rodriguez@example.com',
        phone: '+1 234 567 8904',
        address: 'Avenida Norte 654, Ciudad',
        dateOfBirth: new Date('1994-07-12'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Sofia',
        lastName: 'Hernández',
        email: 'sofia.hernandez@example.com',
        phone: '+1 234 567 8905',
        address: 'Calle Sur 987, Ciudad',
        dateOfBirth: new Date('1999-11-03'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Diego',
        lastName: 'González',
        email: 'diego.gonzalez@example.com',
        phone: '+1 234 567 8906',
        address: 'Boulevard Este 147, Ciudad',
        dateOfBirth: new Date('1993-02-28'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Valentina',
        lastName: 'Morales',
        email: 'valentina.morales@example.com',
        phone: '+1 234 567 8907',
        address: 'Calle Oeste 258, Ciudad',
        dateOfBirth: new Date('2000-09-15'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Andrés',
        lastName: 'Silva',
        email: 'andres.silva@example.com',
        phone: '+1 234 567 8908',
        address: 'Avenida Diagonal 369, Ciudad',
        dateOfBirth: new Date('1992-04-20'),
        status: StudentStatus.INACTIVE
      },
      {
        name: 'Camila',
        lastName: 'Vargas',
        email: 'camila.vargas@example.com',
        phone: '+1 234 567 8909',
        address: 'Calle Transversal 741, Ciudad',
        dateOfBirth: new Date('1998-06-08'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Sebastián',
        lastName: 'Jiménez',
        email: 'sebastian.jimenez@example.com',
        phone: '+1 234 567 8910',
        address: 'Plaza Central 852, Ciudad',
        dateOfBirth: new Date('1995-10-14'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Isabella',
        lastName: 'Torres',
        email: 'isabella.torres@example.com',
        phone: '+1 234 567 8911',
        address: 'Calle Principal 963, Ciudad',
        dateOfBirth: new Date('1997-01-25'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Mateo',
        lastName: 'Reyes',
        email: 'mateo.reyes@example.com',
        phone: '+1 234 567 8912',
        address: 'Avenida Secundaria 159, Ciudad',
        dateOfBirth: new Date('1996-12-05'),
        status: StudentStatus.ACTIVE
      },
      {
        name: 'Natalia',
        lastName: 'Castro',
        email: 'natalia.castro@example.com',
        phone: '+1 234 567 8913',
        address: 'Boulevard Norte 357, Ciudad',
        dateOfBirth: new Date('1999-03-30'),
        status: StudentStatus.INACTIVE
      },
      {
        name: 'Alejandro',
        lastName: 'Mendoza',
        email: 'alejandro.mendoza@example.com',
        phone: '+1 234 567 8914',
        address: 'Calle Este 468, Ciudad',
        dateOfBirth: new Date('1994-08-17'),
        status: StudentStatus.ACTIVE
      }
    ];

    const savedStudents = await studentRepository.save(students);
    console.log(`👥 Created ${savedStudents.length} students`);

    // Create courses - Primaria (1° a 6° grado)
    const courses = [
      {
        name: 'Primer Grado',
        description: 'Curso completo de primer grado de primaria - Lectoescritura, matemáticas básicas, ciencias naturales y sociales',
        code: 'PRIM-001',
        credits: 8,
        price: 120000,
        status: CourseStatus.ACTIVE
      },
      {
        name: 'Segundo Grado',
        description: 'Curso completo de segundo grado de primaria - Desarrollo de habilidades de lectura, operaciones matemáticas básicas',
        code: 'PRIM-002',
        credits: 8,
        price: 125000,
        status: CourseStatus.ACTIVE
      },
      {
        name: 'Tercer Grado',
        description: 'Curso completo de tercer grado de primaria - Comprensión lectora, multiplicación y división, ciencias experimentales',
        code: 'PRIM-003',
        credits: 8,
        price: 130000,
        status: CourseStatus.ACTIVE
      },
      {
        name: 'Cuarto Grado',
        description: 'Curso completo de cuarto grado de primaria - Redacción, fracciones, historia y geografía local',
        code: 'PRIM-004',
        credits: 8,
        price: 135000,
        status: CourseStatus.ACTIVE
      },
      {
        name: 'Quinto Grado',
        description: 'Curso completo de quinto grado de primaria - Análisis de textos, decimales, ciencias naturales avanzadas',
        code: 'PRIM-005',
        credits: 8,
        price: 140000,
        status: CourseStatus.ACTIVE
      },
      {
        name: 'Sexto Grado',
        description: 'Curso completo de sexto grado de primaria - Preparación para secundaria, álgebra básica, ciencias integradas',
        code: 'PRIM-006',
        credits: 8,
        price: 145000,
        status: CourseStatus.ACTIVE
      }
    ];

    const savedCourses = await courseRepository.save(courses);
    console.log(`📚 Created ${savedCourses.length} courses`);

    // Create payments
    const payments = [
      {
        student: savedStudents[0],
        amount: 150000,
        method: PaymentMethod.CASH,
        status: PaymentStatus.COMPLETED,
        description: 'Pago mensual de Matemáticas Avanzadas',
        dueDate: new Date('2024-01-15'),
        paidAt: new Date('2024-01-15')
      },
      {
        student: savedStudents[1],
        amount: 120000,
        method: PaymentMethod.CARD,
        status: PaymentStatus.COMPLETED,
        description: 'Pago mensual de Física I',
        dueDate: new Date('2024-01-20'),
        paidAt: new Date('2024-01-20')
      },
      {
        student: savedStudents[0],
        amount: 180000,
        method: PaymentMethod.TRANSFER,
        status: PaymentStatus.PENDING,
        description: 'Pago pendiente de Química Orgánica',
        dueDate: new Date('2024-02-15')
      },
      {
        student: savedStudents[2],
        amount: 200000,
        method: PaymentMethod.CHECK,
        status: PaymentStatus.COMPLETED,
        description: 'Pago de Programación Web',
        dueDate: new Date('2024-01-25'),
        paidAt: new Date('2024-01-25')
      },
      {
        student: savedStudents[3],
        amount: 150000,
        method: PaymentMethod.CARD,
        status: PaymentStatus.FAILED,
        description: 'Pago fallido de Matemáticas Avanzadas',
        dueDate: new Date('2024-01-30')
      }
    ];

    const savedPayments = await paymentRepository.save(payments);
    console.log(`💳 Created ${savedPayments.length} payments`);

    console.log('✅ Data seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Students: ${savedStudents.length}`);
    console.log(`   - Courses: ${savedCourses.length}`);
    console.log(`   - Payments: ${savedPayments.length}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

seedData();
