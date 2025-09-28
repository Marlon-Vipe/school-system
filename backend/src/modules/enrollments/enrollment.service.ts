import { EnrollmentRepository, EnrollmentFilters } from './enrollment.repository';
import { Enrollment, EnrollmentStatus } from './enrollment.entity';
import { AppError } from '../../utils/appError';
import { PaginationQuery, PaginationResult } from '../../types/common';

export class EnrollmentService {
  private enrollmentRepository: EnrollmentRepository;

  constructor() {
    this.enrollmentRepository = new EnrollmentRepository();
  }

  async createEnrollment(enrollmentData: Partial<Enrollment>): Promise<Enrollment> {
    // Check if student is already enrolled in this course
    const existingEnrollment = await this.enrollmentRepository.findByStudentAndCourse(
      enrollmentData.studentId!,
      enrollmentData.courseId!
    );

    if (existingEnrollment) {
      throw AppError.conflict('Student is already enrolled in this course');
    }

    // Set default values
    if (!enrollmentData.status) {
      enrollmentData.status = EnrollmentStatus.PENDING;
    }

    if (!enrollmentData.enrolledAt) {
      enrollmentData.enrolledAt = new Date();
    }

    return await this.enrollmentRepository.create(enrollmentData);
  }

  async getEnrollmentById(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw AppError.notFound('Enrollment not found');
    }
    return enrollment;
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    const { enrollments } = await this.enrollmentRepository.findAll(
      { page: 1, limit: 1000 }, // Get all enrollments with a high limit
      {}
    );
    return enrollments;
  }

  async getEnrollments(
    pagination: PaginationQuery,
    filters: EnrollmentFilters = {}
  ): Promise<PaginationResult<Enrollment>> {
    const { enrollments, total } = await this.enrollmentRepository.findAll(pagination, filters);
    
    const { page = 1, limit = 10 } = pagination;
    const totalPages = Math.ceil(total / limit);

    return {
      data: enrollments,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async updateEnrollment(id: string, updateData: Partial<Enrollment>): Promise<Enrollment> {
    // Check if enrollment exists
    const existingEnrollment = await this.enrollmentRepository.findById(id);
    if (!existingEnrollment) {
      throw AppError.notFound('Enrollment not found');
    }

    // If changing status to completed, set completedAt
    if (updateData.status === EnrollmentStatus.COMPLETED && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedEnrollment = await this.enrollmentRepository.update(id, updateData);
    if (!updatedEnrollment) {
      throw AppError.internal('Failed to update enrollment');
    }

    return updatedEnrollment;
  }

  async deleteEnrollment(id: string): Promise<void> {
    const existingEnrollment = await this.enrollmentRepository.findById(id);
    if (!existingEnrollment) {
      throw AppError.notFound('Enrollment not found');
    }

    const success = await this.enrollmentRepository.delete(id);
    if (!success) {
      throw AppError.internal('Failed to delete enrollment');
    }
  }

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.findByStudent(studentId);
  }

  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.findByCourse(courseId);
  }

  async getEnrollmentStats(): Promise<{
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
  }> {
    return await this.enrollmentRepository.getEnrollmentStats();
  }

  async getRecentEnrollments(limit: number = 5): Promise<Enrollment[]> {
    return await this.enrollmentRepository.findRecent(limit);
  }

  async approveEnrollment(id: string): Promise<Enrollment> {
    return await this.updateEnrollment(id, { 
      status: EnrollmentStatus.ACTIVE,
      enrolledAt: new Date()
    });
  }

  async completeEnrollment(id: string, finalGrade?: number, notes?: string): Promise<Enrollment> {
    return await this.updateEnrollment(id, { 
      status: EnrollmentStatus.COMPLETED,
      completedAt: new Date(),
      finalGrade,
      notes
    });
  }

  async cancelEnrollment(id: string, notes?: string): Promise<Enrollment> {
    return await this.updateEnrollment(id, { 
      status: EnrollmentStatus.CANCELLED,
      notes
    });
  }
}



