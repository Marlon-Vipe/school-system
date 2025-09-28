import { Course, CourseStatus } from './course.entity';
import { AppError } from '../../utils/appError';

export class CourseService {
  async getAllCourses(): Promise<Course[]> {
    try {
      // Import the database connection
      const { AppDataSource } = await import('../../config/database');
      const courseRepository = AppDataSource.getRepository(Course);
      
      // Get all courses from database
      return await courseRepository.find({
        order: { name: 'ASC' }
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw AppError.internal('Failed to get courses');
    }
  }

  async getCourseById(id: string): Promise<Course> {
    try {
      const { AppDataSource } = await import('../../config/database');
      const courseRepository = AppDataSource.getRepository(Course);
      
      const course = await courseRepository.findOne({
        where: { id },
        relations: ['students', 'enrollments']
      });
      
      if (!course) {
        throw AppError.notFound('Course not found');
      }
      
      return course;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error fetching course by ID:', error);
      throw AppError.internal('Failed to get course');
    }
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      const { AppDataSource } = await import('../../config/database');
      const courseRepository = AppDataSource.getRepository(Course);
      
      // Validate required fields
      if (!courseData.name || !courseData.code || !courseData.price) {
        throw AppError.badRequest('Name, code, and price are required');
      }
      
      // Check if course code already exists
      const existingCourse = await courseRepository.findOne({
        where: { code: courseData.code }
      });
      
      if (existingCourse) {
        throw AppError.badRequest('Course code already exists');
      }
      
      // Create new course
      const course = courseRepository.create({
        name: courseData.name,
        description: courseData.description,
        code: courseData.code,
        price: courseData.price,
        duration: courseData.duration || 0,
        status: courseData.status || CourseStatus.ACTIVE,
        category: courseData.category,
        maxStudents: courseData.maxStudents || 0,
        startDate: courseData.startDate,
        endDate: courseData.endDate
      });
      
      return await courseRepository.save(course);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating course:', error);
      throw AppError.internal('Failed to create course');
    }
  }

  async updateCourse(id: string, updateData: Partial<Course>): Promise<Course> {
    try {
      const { AppDataSource } = await import('../../config/database');
      const courseRepository = AppDataSource.getRepository(Course);
      
      // Find the course
      const course = await courseRepository.findOne({ where: { id } });
      if (!course) {
        throw AppError.notFound('Course not found');
      }
      
      // Check if new code already exists (if code is being updated)
      if (updateData.code && updateData.code !== course.code) {
        const existingCourse = await courseRepository.findOne({
          where: { code: updateData.code }
        });
        
        if (existingCourse) {
          throw AppError.badRequest('Course code already exists');
        }
      }
      
      // Update course
      Object.assign(course, updateData);
      
      return await courseRepository.save(course);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating course:', error);
      throw AppError.internal('Failed to update course');
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      const { AppDataSource } = await import('../../config/database');
      const courseRepository = AppDataSource.getRepository(Course);
      
      // Find the course
      const course = await courseRepository.findOne({ 
        where: { id },
        relations: ['students', 'enrollments']
      });
      
      if (!course) {
        throw AppError.notFound('Course not found');
      }
      
      // Check if course has students or enrollments
      if (course.students && course.students.length > 0) {
        throw AppError.badRequest('Cannot delete course with enrolled students');
      }
      
      if (course.enrollments && course.enrollments.length > 0) {
        throw AppError.badRequest('Cannot delete course with existing enrollments');
      }
      
      await courseRepository.remove(course);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting course:', error);
      throw AppError.internal('Failed to delete course');
    }
  }
}