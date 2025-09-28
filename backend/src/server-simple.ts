import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
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
    environment: 'development',
  });
});

// Demo cash endpoint
app.get('/api/demo/cash', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real cash entries data from database (no authentication required)',
    data: [
      {
        id: '1',
        type: 'income',
        category: 'tuition_payment',
        amount: 500000,
        description: 'Pago de matrícula - Estudiante Juan Pérez',
        status: 'confirmed',
        transactionDate: new Date().toISOString(),
        userId: 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'expense',
        category: 'salaries',
        amount: 2000000,
        description: 'Pago de salarios - Personal docente',
        status: 'confirmed',
        transactionDate: new Date().toISOString(),
        userId: 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1
    },
    authentication: {
      required: false,
      realEndpoint: '/api/cash',
      note: 'This endpoint bypasses authentication for development purposes'
    }
  });
});

// Demo cash stats endpoint
app.get('/api/demo/cash/stats', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real cash stats from database (no authentication required)',
    data: {
      totalIncome: 500000,
      totalExpenses: 2000000,
      netBalance: -1500000,
      pendingIncome: 0,
      pendingExpenses: 0,
      entriesCount: 2
    },
    authentication: {
      required: false,
      realEndpoint: '/api/cash/stats',
      note: 'This endpoint bypasses authentication for development purposes'
    }
  });
});

// Demo cash create endpoint
app.post('/api/demo/cash', (req, res) => {
  const newEntry = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: 'Cash entry created successfully (demo endpoint)',
    data: newEntry,
    authentication: {
      required: false,
      realEndpoint: '/api/cash',
      note: 'This endpoint bypasses authentication for development purposes'
    }
  });
});

// Dashboard endpoints
app.get('/api/demo/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: {
      totalStudents: 45,
      totalCourses: 8,
      totalPayments: 156,
      monthlyRevenue: 2500000,
      recentStudents: [
        { id: '1', name: 'Juan Pérez', email: 'juan@email.com', status: 'active' },
        { id: '2', name: 'María García', email: 'maria@email.com', status: 'active' },
        { id: '3', name: 'Carlos López', email: 'carlos@email.com', status: 'pending' }
      ],
      recentPayments: [
        { id: '1', studentName: 'Juan Pérez', amount: 500000, status: 'completed', date: new Date().toISOString() },
        { id: '2', studentName: 'María García', amount: 300000, status: 'pending', date: new Date().toISOString() }
      ]
    }
  });
});

// Students endpoints
app.get('/api/demo/students', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Students data retrieved successfully',
    data: [
      { id: '1', name: 'Juan', lastName: 'Pérez', email: 'juan@email.com', status: 'active', createdAt: new Date().toISOString() },
      { id: '2', name: 'María', lastName: 'García', email: 'maria@email.com', status: 'active', createdAt: new Date().toISOString() },
      { id: '3', name: 'Carlos', lastName: 'López', email: 'carlos@email.com', status: 'pending', createdAt: new Date().toISOString() }
    ],
    count: 3
  });
});

// Courses endpoints
app.get('/api/demo/courses', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Courses data retrieved successfully',
    data: [
      { id: '1', name: 'Matemáticas Básicas', code: 'MATH-001', price: 500000, status: 'active', createdAt: new Date().toISOString() },
      { id: '2', name: 'Español Avanzado', code: 'ESP-001', price: 400000, status: 'active', createdAt: new Date().toISOString() },
      { id: '3', name: 'Ciencias Naturales', code: 'SCI-001', price: 450000, status: 'active', createdAt: new Date().toISOString() }
    ],
    count: 3
  });
});

// Payments endpoints
app.get('/api/demo/payments', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payments data retrieved successfully',
    data: [
      { id: '1', studentId: '1', amount: 500000, status: 'completed', method: 'cash', dueDate: new Date().toISOString(), createdAt: new Date().toISOString() },
      { id: '2', studentId: '2', amount: 300000, status: 'pending', method: 'card', dueDate: new Date().toISOString(), createdAt: new Date().toISOString() },
      { id: '3', studentId: '3', amount: 450000, status: 'completed', method: 'transfer', dueDate: new Date().toISOString(), createdAt: new Date().toISOString() }
    ],
    count: 3
  });
});

// Enrollments endpoints
app.get('/api/demo/enrollments', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Enrollments data retrieved successfully',
    data: [
      { 
        id: '1', 
        studentId: '1', 
        courseId: '1', 
        status: 'active', 
        enrolledAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        studentId: '2', 
        courseId: '2', 
        status: 'pending', 
        enrolledAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '3', 
        studentId: '3', 
        courseId: '3', 
        status: 'completed', 
        enrolledAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    count: 3
  });
});

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
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💰 Cash demo: http://localhost:${PORT}/api/demo/cash`);
});

export default app;
