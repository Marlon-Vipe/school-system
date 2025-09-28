import { Course, CourseStatus } from './course.entity';
import { AppError } from '../../utils/appError';

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Matemáticas Básicas',
    description: 'Curso introductorio de matemáticas para principiantes',
    code: 'MATH-101',
    price: 150.00,
    duration: 40,
    status: CourseStatus.ACTIVE,
    category: 'Ciencias',
    maxStudents: 25,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-15'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    students: [],
    enrollments: []
  },
  {
    id: '2',
    name: 'Programación en JavaScript',
    description: 'Aprende JavaScript desde cero hasta nivel avanzado',
    code: 'JS-201',
    price: 200.00,
    duration: 60,
    status: CourseStatus.ACTIVE,
    category: 'Tecnología',
    maxStudents: 20,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-07-01'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    students: [],
    enrollments: []
  },
  {
    id: '3',
    name: 'Historia del Arte',
    description: 'Exploración de los movimientos artísticos más importantes',
    code: 'ART-301',
    price: 120.00,
    duration: 30,
    status: CourseStatus.DRAFT,
    category: 'Humanidades',
    maxStudents: 15,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    students: [],
    enrollments: []
  },
  {
    id: '4',
    name: 'Física Cuántica',
    description: 'Introducción a los principios de la mecánica cuántica',
    code: 'PHYS-401',
    price: 250.00,
    duration: 80,
    status: CourseStatus.INACTIVE,
    category: 'Ciencias',
    maxStudents: 12,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
    students: [],
    enrollments: []
  }
];

export class CourseServiceMock {
  async getAllCourses(): Promise<Course[]> {
    try {
      console.log('📚 Mock: Getting all courses');
      return mockCourses.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw AppError.internal('Failed to get courses');
    }
  }

  async getCourseById(id: string): Promise<Course> {
    try {
      console.log(`📚 Mock: Getting course by ID: ${id}`);
      const course = mockCourses.find(c => c.id === id);
      
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
      console.log('📚 Mock: Creating new course');
      
      // Validate required fields
      if (!courseData.name || !courseData.code || !courseData.price) {
        throw AppError.badRequest('Name, code, and price are required');
      }
      
      // Check if course code already exists
      const existingCourse = mockCourses.find(c => c.code === courseData.code);
      if (existingCourse) {
        throw AppError.badRequest('Course code already exists');
      }
      
      // Create new course
      const newCourse: Course = {
        id: (mockCourses.length + 1).toString(),
        name: courseData.name,
        description: courseData.description,
        code: courseData.code,
        price: courseData.price,
        duration: courseData.duration || 0,
        status: courseData.status || CourseStatus.ACTIVE,
        category: courseData.category,
        maxStudents: courseData.maxStudents || 0,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        students: [],
        enrollments: []
      };
      
      mockCourses.push(newCourse);
      return newCourse;
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
      console.log(`📚 Mock: Updating course: ${id}`);
      
      const courseIndex = mockCourses.findIndex(c => c.id === id);
      if (courseIndex === -1) {
        throw AppError.notFound('Course not found');
      }
      
      // Check if new code already exists (if code is being updated)
      if (updateData.code && updateData.code !== mockCourses[courseIndex].code) {
        const existingCourse = mockCourses.find(c => c.code === updateData.code);
        if (existingCourse) {
          throw AppError.badRequest('Course code already exists');
        }
      }
      
      // Update course
      mockCourses[courseIndex] = {
        ...mockCourses[courseIndex],
        ...updateData,
        updatedAt: new Date()
      };
      
      return mockCourses[courseIndex];
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
      console.log(`📚 Mock: Deleting course: ${id}`);
      
      const courseIndex = mockCourses.findIndex(c => c.id === id);
      if (courseIndex === -1) {
        throw AppError.notFound('Course not found');
      }
      
      // Check if course has students or enrollments
      const course = mockCourses[courseIndex];
      if (course.students && course.students.length > 0) {
        throw AppError.badRequest('Cannot delete course with enrolled students');
      }
      
      if (course.enrollments && course.enrollments.length > 0) {
        throw AppError.badRequest('Cannot delete course with existing enrollments');
      }
      
      mockCourses.splice(courseIndex, 1);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting course:', error);
      throw AppError.internal('Failed to delete course');
    }
  }
}
