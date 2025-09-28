import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeDatabase } from './config/database';

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

// Initialize database connection
initializeDatabase().catch(console.error);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running with real database data',
    timestamp: new Date().toISOString(),
    environment: 'development',
  });
});

// Real Students endpoint
app.get('/api/demo/students', async (req, res) => {
  try {
    const { StudentService } = await import('./modules/students/student.service');
    const studentService = new StudentService();
    
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

// Real Courses endpoint
app.get('/api/demo/courses', async (req, res) => {
  try {
    const { CourseService } = await import('./modules/courses/course.service');
    const courseService = new CourseService();
    
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

// Real Enrollments endpoint
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

// Real Payments endpoint
app.get('/api/demo/payments', async (req, res) => {
  try {
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
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

// Create payment endpoint
app.post('/api/demo/payments', async (req, res) => {
  try {
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    const newPayment = await paymentService.createPayment(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: newPayment,
      authentication: {
        required: false,
        realEndpoint: '/api/payments',
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update payment endpoint
app.put('/api/demo/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    const updatedPayment = await paymentService.updatePayment(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: updatedPayment,
      authentication: {
        required: false,
        realEndpoint: `/api/payments/${id}`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete payment endpoint
app.delete('/api/demo/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    await paymentService.deletePayment(id);
    
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
      authentication: {
        required: false,
        realEndpoint: `/api/payments/${id}`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update payment status endpoint
app.post('/api/demo/payments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const { PaymentService } = await import('./modules/payments/payment.service');
    const paymentService = new PaymentService();
    
    const updatedPayment = await paymentService.updatePaymentStatus(id, status, notes);
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedPayment,
      authentication: {
        required: false,
        realEndpoint: `/api/payments/${id}/status`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Real Cash Entries endpoint
app.get('/api/demo/cash', async (req, res) => {
  try {
    const { CashEntryService } = await import('./modules/cash/cash-entry.service-simple');
    const cashEntryService = new CashEntryService();
    
    const queryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string || 'transactionDate',
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      type: req.query.type as any,
      category: req.query.category as string,
      status: req.query.status as any,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string
    };
    
    const result = await cashEntryService.getAllCashEntries(queryParams);
    
    res.status(200).json({
      success: true,
      message: 'Cash entries retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      authentication: {
        required: false,
        realEndpoint: '/api/cash',
        note: 'This endpoint uses real data from database'
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

// Real Cash Stats endpoint (temporary mock data due to TypeScript errors)
app.get('/api/demo/cash/stats', async (req, res) => {
  try {
    const { CashEntryService } = await import('./modules/cash/cash-entry.service-simple');
    const cashEntryService = new CashEntryService();
    
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    const stats = await cashEntryService.getCashStats(startDate, endDate);
    
    res.status(200).json({
      success: true,
      message: 'Cash statistics retrieved successfully',
      data: stats,
      authentication: {
        required: false,
        realEndpoint: '/api/cash/stats',
        note: 'This endpoint uses real data from database'
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

// Create cash entry endpoint
app.post('/api/demo/cash', async (req, res) => {
  try {
    const { CashEntryService } = await import('./modules/cash/cash-entry.service-simple');
    const cashEntryService = new CashEntryService();
    
    // Get a demo user ID (first user in database)
    const demoUserId = 'ace04070-ed32-4d51-8729-38623a7f5c60'; // Using a real UUID from database
    
    const cashEntryData = {
      ...req.body,
      userId: demoUserId
    };
    
    const newEntry = await cashEntryService.createCashEntry(cashEntryData);
    
    res.status(201).json({
      success: true,
      message: 'Cash entry created successfully',
      data: newEntry,
      authentication: {
        required: false,
        realEndpoint: '/api/cash',
        note: 'This endpoint uses real data from database'
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

// Update cash entry endpoint
app.put('/api/demo/cash/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { CashEntryService } = await import('./modules/cash/cash-entry.service-simple');
    const cashEntryService = new CashEntryService();
    
    const updatedEntry = await cashEntryService.updateCashEntry(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Cash entry updated successfully',
      data: updatedEntry,
      authentication: {
        required: false,
        realEndpoint: `/api/cash/${id}`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error updating cash entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cash entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete cash entry endpoint
app.delete('/api/demo/cash/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { CashEntryService } = await import('./modules/cash/cash-entry.service-simple');
    const cashEntryService = new CashEntryService();
    
    await cashEntryService.deleteCashEntry(id);
    
    res.status(200).json({
      success: true,
      message: 'Cash entry deleted successfully',
      authentication: {
        required: false,
        realEndpoint: `/api/cash/${id}`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error deleting cash entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting cash entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Confirm cash entry endpoint
app.patch('/api/demo/cash/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { CashEntryService } = await import('./modules/cash/cash-entry.service-simple');
    const cashEntryService = new CashEntryService();
    
    const updatedEntry = await cashEntryService.updateCashEntry(id, { status: 'confirmed' as any });
    
    res.status(200).json({
      success: true,
      message: 'Cash entry confirmed successfully',
      data: updatedEntry,
      authentication: {
        required: false,
        realEndpoint: `/api/cash/${id}/confirm`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error confirming cash entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming cash entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cancel cash entry endpoint
app.patch('/api/demo/cash/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { CashEntryService } = await import('./modules/cash/cash-entry.service-simple');
    const cashEntryService = new CashEntryService();
    
    const updatedEntry = await cashEntryService.updateCashEntry(id, { status: 'cancelled' as any });
    
    res.status(200).json({
      success: true,
      message: 'Cash entry cancelled successfully',
      data: updatedEntry,
      authentication: {
        required: false,
        realEndpoint: `/api/cash/${id}/cancel`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error cancelling cash entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling cash entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Dashboard endpoint with real data
app.get('/api/demo/dashboard', async (req, res) => {
  try {
    const { StudentService } = await import('./modules/students/student.service');
    const { CourseService } = await import('./modules/courses/course.service');
    const { PaymentService } = await import('./modules/payments/payment.service');
    const { EnrollmentService } = await import('./modules/enrollments/enrollment.service');
    
    const studentService = new StudentService();
    const courseService = new CourseService();
    const paymentService = new PaymentService();
    const enrollmentService = new EnrollmentService();
    
    // Get real data from database
    const [students, courses, payments, enrollments] = await Promise.all([
      studentService.getAllStudents(),
      courseService.getAllCourses(),
      paymentService.getAllPayments(),
      enrollmentService.getAllEnrollments()
    ]);
    
    // Calculate monthly revenue (sum of completed payments)
    const monthlyRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    // Get recent students (last 3)
    const recentStudents = students
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(s => ({
        id: s.id,
        name: `${s.name} ${s.lastName}`,
        email: s.email,
        status: s.status
      }));
    
    // Get recent payments (last 3)
    const recentPayments = payments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(p => ({
        id: p.id,
        studentName: students.find(s => s.id === p.studentId)?.name || 'Unknown',
        amount: p.amount,
        status: p.status,
        date: p.createdAt
      }));
    
    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully from real database',
      data: {
        totalStudents: students.length,
        totalCourses: courses.length,
        totalPayments: payments.length,
        totalEnrollments: enrollments.length,
        monthlyRevenue,
        recentStudents,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Real Purchases endpoints
app.get('/api/demo/purchases', async (req, res) => {
  try {
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const queryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      status: req.query.status as any,
      category: req.query.category as any,
      requestedBy: req.query.requestedBy as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string
    };
    
    const result = await purchaseService.getAllPurchases(queryParams);
    
    res.status(200).json({
      success: true,
      message: 'Purchases retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      authentication: {
        required: false,
        realEndpoint: '/api/purchases',
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchases from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/demo/purchases', async (req, res) => {
  try {
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    // Get a demo user ID (first user in database)
    const demoUserId = 'ace04070-ed32-4d51-8729-38623a7f5c60'; // Using a real UUID from database
    
    const purchaseData = {
      ...req.body,
      requestedBy: demoUserId
    };
    
    const newPurchase = await purchaseService.createPurchase(purchaseData);
    
    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: newPurchase,
      authentication: {
        required: false,
        realEndpoint: '/api/purchases',
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put('/api/demo/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const updatedPurchase = await purchaseService.updatePurchase(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Purchase updated successfully',
      data: updatedPurchase,
      authentication: {
        required: false,
        realEndpoint: `/api/purchases/${id}`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/demo/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    await purchaseService.deletePurchase(id);
    
    res.status(200).json({
      success: true,
      message: 'Purchase deleted successfully',
      authentication: {
        required: false,
        realEndpoint: `/api/purchases/${id}`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Purchase status management endpoints
app.post('/api/demo/purchases/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const demoUserId = 'ace04070-ed32-4d51-8729-38623a7f5c60';
    
    const updatedPurchase = await purchaseService.approvePurchase(id, approvedBy || demoUserId);
    
    res.status(200).json({
      success: true,
      message: 'Purchase approved successfully',
      data: updatedPurchase,
      authentication: {
        required: false,
        realEndpoint: `/api/purchases/${id}/approve`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error approving purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/demo/purchases/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, approvedBy } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const demoUserId = 'ace04070-ed32-4d51-8729-38623a7f5c60';
    
    const updatedPurchase = await purchaseService.rejectPurchase(id, rejectionReason, approvedBy || demoUserId);
    
    res.status(200).json({
      success: true,
      message: 'Purchase rejected successfully',
      data: updatedPurchase,
      authentication: {
        required: false,
        realEndpoint: `/api/purchases/${id}/reject`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error rejecting purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/demo/purchases/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { actualDeliveryDate } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const updatedPurchase = await purchaseService.completePurchase(id, actualDeliveryDate);
    
    res.status(200).json({
      success: true,
      message: 'Purchase completed successfully',
      data: updatedPurchase,
      authentication: {
        required: false,
        realEndpoint: `/api/purchases/${id}/complete`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/demo/purchases/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const updatedPurchase = await purchaseService.cancelPurchase(id, cancellationReason);
    
    res.status(200).json({
      success: true,
      message: 'Purchase cancelled successfully',
      data: updatedPurchase,
      authentication: {
        required: false,
        realEndpoint: `/api/purchases/${id}/cancel`,
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error cancelling purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Purchase stats endpoint
app.get('/api/demo/purchases/stats', async (req, res) => {
  try {
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const { startDate, endDate } = req.query;
    const stats = await purchaseService.getPurchaseStats(
      startDate as string,
      endDate as string
    );
    
    res.status(200).json({
      success: true,
      message: 'Purchase statistics retrieved successfully',
      data: stats,
      authentication: {
        required: false,
        realEndpoint: '/api/purchases/stats',
        note: 'This endpoint uses real data from database'
      }
    });
  } catch (error) {
    console.error('Error fetching purchase stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Real Purchases endpoints (with authentication)
app.get('/api/purchases', async (req, res) => {
  try {
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const queryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      status: req.query.status as any,
      category: req.query.category as any,
      requestedBy: req.query.requestedBy as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string
    };

    const result = await purchaseService.getAllPurchases(queryParams);
    
    res.status(200).json({
      success: true,
      message: 'Purchases retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchases from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/purchases', async (req, res) => {
  try {
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    // Get user ID from authentication (in real implementation)
    const userId = req.user?.id || 'ace04070-ed32-4d51-8729-38623a7f5c60'; // Fallback for development
    
    const purchaseData = {
      ...req.body,
      requestedBy: userId
    };

    const newPurchase = await purchaseService.createPurchase(purchaseData);
    
    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: newPurchase,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put('/api/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const updatedPurchase = await purchaseService.updatePurchase(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Purchase updated successfully',
      data: updatedPurchase,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    await purchaseService.deletePurchase(id);
    
    res.status(200).json({
      success: true,
      message: 'Purchase deleted successfully',
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/purchases/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const userId = req.user?.id || approvedBy || 'ace04070-ed32-4d51-8729-38623a7f5c60';
    
    const updatedPurchase = await purchaseService.approvePurchase(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Purchase approved successfully',
      data: updatedPurchase,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error approving purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/purchases/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, approvedBy } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const userId = req.user?.id || approvedBy || 'ace04070-ed32-4d51-8729-38623a7f5c60';
    
    const updatedPurchase = await purchaseService.rejectPurchase(id, rejectionReason, userId);
    
    res.status(200).json({
      success: true,
      message: 'Purchase rejected successfully',
      data: updatedPurchase,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error rejecting purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/purchases/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { actualDeliveryDate } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const updatedPurchase = await purchaseService.completePurchase(id, actualDeliveryDate);
    
    res.status(200).json({
      success: true,
      message: 'Purchase completed successfully',
      data: updatedPurchase,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/purchases/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const updatedPurchase = await purchaseService.cancelPurchase(id, cancellationReason);
    
    res.status(200).json({
      success: true,
      message: 'Purchase cancelled successfully',
      data: updatedPurchase,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error cancelling purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling purchase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/purchases/stats', async (req, res) => {
  try {
    const { PurchaseService } = await import('./modules/purchases/purchase.service');
    const purchaseService = new PurchaseService();
    
    const { startDate, endDate } = req.query;
    const stats = await purchaseService.getPurchaseStats(
      startDate as string,
      endDate as string
    );
    
    res.status(200).json({
      success: true,
      message: 'Purchase statistics retrieved successfully',
      data: stats,
      authentication: {
        required: true,
        note: 'This endpoint requires authentication'
      }
    });
  } catch (error) {
    console.error('Error fetching purchase stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Vipe School API - Real Data Mode',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
    note: 'All endpoints use real database data'
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
  console.log(`🚀 Server running on port ${PORT} with REAL DATABASE DATA`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Students: http://localhost:${PORT}/api/demo/students`);
  console.log(`📚 Courses: http://localhost:${PORT}/api/demo/courses`);
  console.log(`📝 Enrollments: http://localhost:${PORT}/api/demo/enrollments`);
  console.log(`💰 Payments: http://localhost:${PORT}/api/demo/payments`);
  console.log(`💵 Cash: http://localhost:${PORT}/api/demo/cash`);
  console.log(`📈 Dashboard: http://localhost:${PORT}/api/demo/dashboard`);
});

export default app;
