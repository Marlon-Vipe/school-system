import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

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
    message: 'API is running in MOCK mode',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    mode: 'MOCK'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vipe School API (Mock Mode)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    mode: 'MOCK',
    endpoints: {
      health: '/api/health',
      courses: '/api/demo/courses',
      students: '/api/demo/students',
      enrollments: '/api/demo/enrollments',
      payments: '/api/demo/payments'
    }
  });
});

// Demo endpoints for courses (using mock data)
app.get('/api/demo/courses', async (req, res) => {
  try {
    // Import the mock course service
    const { CourseServiceMock } = await import('./modules/courses/course.service-mock');
    const courseService = new CourseServiceMock();
    
    // Get mock courses
    const courses = await courseService.getAllCourses();
    
    res.status(200).json({
      success: true,
      message: 'Mock courses data (no authentication required)',
      data: courses,
      count: courses.length,
      authentication: {
        required: false,
        realEndpoint: '/api/courses',
        note: 'This endpoint uses mock data for development purposes'
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo CRUD endpoints for courses (using mock data)
app.post('/api/demo/courses', async (req, res) => {
  try {
    const { CourseServiceMock } = await import('./modules/courses/course.service-mock');
    const courseService = new CourseServiceMock();
    
    const course = await courseService.createCourse(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully (mock endpoint)',
      data: course,
      authentication: {
        required: false,
        realEndpoint: '/api/courses',
        note: 'This endpoint uses mock data for development purposes'
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
    const { CourseServiceMock } = await import('./modules/courses/course.service-mock');
    const courseService = new CourseServiceMock();
    
    const course = await courseService.updateCourse(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully (mock endpoint)',
      data: course,
      authentication: {
        required: false,
        realEndpoint: '/api/courses/:id',
        note: 'This endpoint uses mock data for development purposes'
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
    const { CourseServiceMock } = await import('./modules/courses/course.service-mock');
    const courseService = new CourseServiceMock();
    
    await courseService.deleteCourse(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully (mock endpoint)',
      authentication: {
        required: false,
        realEndpoint: '/api/courses/:id',
        note: 'This endpoint uses mock data for development purposes'
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

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
