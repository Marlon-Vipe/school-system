import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import studentRoutes from './modules/students/student.routes';
import courseRoutes from './modules/courses/course.routes';
import enrollmentRoutes from './modules/enrollments/enrollment.routes';
import paymentRoutes from './modules/payments/payment.routes';
import userRoutes from './modules/users/user.routes';
import roleRoutes from './modules/roles/role.routes';
import cashEntryRoutes from './modules/cash/cash-entry.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Hardcoded for development
  credentials: true,
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vipe School API',
    version: '1.0.0',
    status: 'running',
    environment: config.nodeEnv,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      courses: '/api/courses',
      enrollments: '/api/enrollments',
      payments: '/api/payments',
      users: '/api/users',
      roles: '/api/roles',
      cash: '/api/cash'
    },
    documentation: 'See README.md for detailed API documentation',
    authentication: {
      note: 'Most endpoints require authentication',
      login: 'POST /api/auth/login',
      example: {
        email: 'admin@vipeschool.com',
        password: 'admin123'
      }
    }
  });
});

// Public endpoints that access real database data (no authentication required)
app.get('/api/demo/students', async (req, res) => {
  try {
    // Import the student service to access real data
    const { StudentService } = await import('./modules/students/student.service');
    const studentService = new StudentService();
    
    // Get real students from database
    const students = await studentService.getAllStudents();
    
    res.status(200).json({
      success: true,
      message: 'Real students data from database (no authentication required)',
      data: students,
      count: students.length,
      authentication: {
        required: false,
        realEndpoint: '/api/students',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/demo/courses', async (req, res) => {
  try {
    // Import the course service to access real data
    const { CourseService } = await import('./modules/courses/course.service');
    const courseService = new CourseService();
    
    // Get real courses from database
    const courses = await courseService.getAllCourses();
    
    res.status(200).json({
      success: true,
      message: 'Real courses data from database (no authentication required)',
      data: courses,
      count: courses.length,
      authentication: {
        required: false,
        realEndpoint: '/api/courses',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo CRUD endpoints for courses (no authentication required for development)
app.post('/api/demo/courses', async (req, res) => {
  try {
    const { CourseService } = await import('./modules/courses/course.service');
    const courseService = new CourseService();
    
    const course = await courseService.createCourse(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully (demo endpoint)',
      data: course,
      authentication: {
        required: false,
        realEndpoint: '/api/courses',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put('/api/demo/courses/:id', async (req, res) => {
  try {
    const { CourseService } = await import('./modules/courses/course.service');
    const courseService = new CourseService();
    
    const course = await courseService.updateCourse(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully (demo endpoint)',
      data: course,
      authentication: {
        required: false,
        realEndpoint: '/api/courses/:id',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/demo/courses/:id', async (req, res) => {
  try {
    const { CourseService } = await import('./modules/courses/course.service');
    const courseService = new CourseService();
    
    await courseService.deleteCourse(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully (demo endpoint)',
      authentication: {
        required: false,
        realEndpoint: '/api/courses/:id',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/demo/payments', async (req, res) => {
  try {
    // Import the payment service to access real data
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    // Get real payments from database
    const payments = await paymentService.getAllPayments();
    
    res.status(200).json({
      success: true,
      message: 'Real payments data from database (no authentication required)',
      data: payments,
      count: payments.length,
      authentication: {
        required: false,
        realEndpoint: '/api/payments',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo endpoints for cash entries (no authentication required for development)
app.get('/api/demo/cash', async (req, res) => {
  try {
    // Import the cash entry service to access real data
    const { CashEntryService } = await import('./modules/cash/cash-entry.service');
    const cashEntryService = new CashEntryService();
    
    // Get query parameters
    const {
      page = 1,
      limit = 10,
      sortBy = 'transactionDate',
      sortOrder = 'DESC',
      type,
      category,
      status,
      startDate,
      endDate,
      search
    } = req.query;

    const params = {
      page: Number(page),
      limit: Number(limit),
      sortBy: String(sortBy),
      sortOrder: sortOrder as 'ASC' | 'DESC',
      type: type as any,
      category: category as string,
      status: status as any,
      startDate: startDate as string,
      endDate: endDate as string,
      search: search as string,
    };
    
    // Get real cash entries from database
    const result = await cashEntryService.getAllCashEntries(params);
    
    res.status(200).json({
      success: true,
      message: 'Real cash entries data from database (no authentication required)',
      data: result.data,
      pagination: result.pagination,
      authentication: {
        required: false,
        realEndpoint: '/api/cash',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error fetching cash entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cash entries from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/demo/cash/stats', async (req, res) => {
  try {
    const { CashEntryService } = await import('./modules/cash/cash-entry.service');
    const cashEntryService = new CashEntryService();
    
    const { startDate, endDate } = req.query;
    const stats = await cashEntryService.getCashStats(
      startDate as string,
      endDate as string
    );
    
    res.status(200).json({
      success: true,
      message: 'Real cash stats from database (no authentication required)',
      data: stats,
      authentication: {
        required: false,
        realEndpoint: '/api/cash/stats',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error fetching cash stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cash stats from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/demo/cash', async (req, res) => {
  try {
    const { CashEntryService } = await import('./modules/cash/cash-entry.service');
    const cashEntryService = new CashEntryService();
    
    // For demo purposes, use a default user ID
    const demoUserId = '00000000-0000-0000-0000-000000000001'; // You can create this user or use an existing one
    
    const data = {
      ...req.body,
      userId: demoUserId,
    };
    
    const cashEntry = await cashEntryService.createCashEntry(data);
    
    res.status(201).json({
      success: true,
      message: 'Cash entry created successfully (demo endpoint)',
      data: cashEntry,
      authentication: {
        required: false,
        realEndpoint: '/api/cash',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error creating cash entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating cash entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST endpoint for creating payments (demo - no authentication required)
app.post('/api/demo/payments', async (req, res) => {
  try {
    // Basic validation
    const { studentId, amount, method } = req.body;
    
    if (!studentId || !amount || !method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, amount, method',
        required: ['studentId', 'amount', 'method']
      });
    }
    
    // Import the payment service to create real payment
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    // Create real payment in database
    const paymentData = req.body;
    console.log('Creating payment with data:', paymentData);
    const payment = await paymentService.createPayment(paymentData);
    
    res.status(201).json({
      success: true,
      message: 'Payment created successfully (no authentication required)',
      data: payment,
      authentication: {
        required: false,
        realEndpoint: '/api/payments',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment in database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT endpoint for updating payments (demo - no authentication required)
app.put('/api/demo/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('Updating payment:', id, 'with data:', updateData);
    
    // Import the payment service
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    // Update payment in database
    const payment = await paymentService.updatePayment(id, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully (no authentication required)',
      data: payment,
      authentication: {
        required: false,
        realEndpoint: `/api/payments/${id}`,
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment in database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST endpoint for updating payment status (demo - no authentication required)
app.post('/api/demo/payments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    console.log('Updating payment status:', id, 'to:', status);
    
    // Import the payment service
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    // Update payment status in database
    const payment = await paymentService.updatePaymentStatus(id, status, notes);
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully (no authentication required)',
      data: payment,
      authentication: {
        required: false,
        realEndpoint: `/api/payments/${id}/status`,
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status in database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo CRUD endpoints for students (no authentication required for development)
app.post('/api/demo/students', async (req, res) => {
  try {
    const { StudentService } = await import('./modules/students/student.service');
    const studentService = new StudentService();
    
    const student = await studentService.createStudent(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully (demo endpoint)',
      data: student,
      authentication: {
        required: false,
        realEndpoint: '/api/students',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put('/api/demo/students/:id', async (req, res) => {
  try {
    const { StudentService } = await import('./modules/students/student.service');
    const studentService = new StudentService();
    
    const { id } = req.params;
    const student = await studentService.updateStudent(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully (demo endpoint)',
      data: student,
      authentication: {
        required: false,
        realEndpoint: '/api/students/:id',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/demo/students/:id', async (req, res) => {
  try {
    const { StudentService } = await import('./modules/students/student.service');
    const studentService = new StudentService();
    
    const { id } = req.params;
    const softDelete = req.query.soft !== 'false'; // Default to soft delete
    
    await studentService.deleteStudent(id, softDelete);
    
    res.status(200).json({
      success: true,
      message: softDelete ? 'Student deactivated successfully (demo endpoint)' : 'Student deleted successfully (demo endpoint)',
      authentication: {
        required: false,
        realEndpoint: '/api/students/:id',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo CRUD endpoints for enrollments (no authentication required for development)
app.get('/api/demo/enrollments', async (req, res) => {
  try {
    const { EnrollmentService } = await import('./modules/enrollments/enrollment.service');
    const enrollmentService = new EnrollmentService();
    
    const enrollments = await enrollmentService.getAllEnrollments();
    
    res.status(200).json({
      success: true,
      message: 'Real enrollments data from database (no authentication required)',
      data: enrollments,
      count: enrollments.length,
      authentication: {
        required: false,
        realEndpoint: '/api/enrollments',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/demo/enrollments', async (req, res) => {
  try {
    const { EnrollmentService } = await import('./modules/enrollments/enrollment.service');
    const enrollmentService = new EnrollmentService();
    
    const enrollment = await enrollmentService.createEnrollment(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully (demo endpoint)',
      data: enrollment,
      authentication: {
        required: false,
        realEndpoint: '/api/enrollments',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating enrollment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put('/api/demo/enrollments/:id', async (req, res) => {
  try {
    const { EnrollmentService } = await import('./modules/enrollments/enrollment.service');
    const enrollmentService = new EnrollmentService();
    
    const { id } = req.params;
    const enrollment = await enrollmentService.updateEnrollment(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully (demo endpoint)',
      data: enrollment,
      authentication: {
        required: false,
        realEndpoint: '/api/enrollments/:id',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating enrollment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/demo/enrollments/:id', async (req, res) => {
  try {
    const { EnrollmentService } = await import('./modules/enrollments/enrollment.service');
    const enrollmentService = new EnrollmentService();
    
    const { id } = req.params;
    
    await enrollmentService.deleteEnrollment(id);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully (demo endpoint)',
      authentication: {
        required: false,
        realEndpoint: '/api/enrollments/:id',
        note: 'This endpoint bypasses authentication for development purposes'
      }
    });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting enrollment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/cash', cashEntryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Vipe School API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;



