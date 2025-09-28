import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Enrollment, EnrollmentStatus } from './enrollment.entity';
import { PaginationQuery, PaginationResult } from '../../types/common';

export interface EnrollmentFilters {
  status?: EnrollmentStatus;
  studentId?: string;
  courseId?: string;
}

export class EnrollmentRepository {
  private repository: Repository<Enrollment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Enrollment);
  }

  async create(enrollmentData: Partial<Enrollment>): Promise<Enrollment> {
    const enrollment = this.repository.create(enrollmentData);
    return await this.repository.save(enrollment);
  }

  async findById(id: string): Promise<Enrollment | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });
  }

  async findAll(
    pagination: PaginationQuery,
    filters: EnrollmentFilters = {}
  ): Promise<{ enrollments: Enrollment[]; total: number }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const { status, studentId, courseId } = filters;

    const queryBuilder = this.repository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.course', 'course');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(student.name ILIKE :search OR student.lastName ILIKE :search OR course.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('enrollment.status = :status', { status });
    }

    if (studentId) {
      queryBuilder.andWhere('enrollment.studentId = :studentId', { studentId });
    }

    if (courseId) {
      queryBuilder.andWhere('enrollment.courseId = :courseId', { courseId });
    }

    // Apply sorting
    queryBuilder.orderBy(`enrollment.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [enrollments, total] = await queryBuilder.getManyAndCount();

    return { enrollments, total };
  }

  async update(id: string, updateData: Partial<Enrollment>): Promise<Enrollment | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return await this.repository.find({
      where: { studentId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return await this.repository.find({
      where: { courseId },
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudentAndCourse(studentId: string, courseId: string): Promise<Enrollment | null> {
    return await this.repository.findOne({
      where: { studentId, courseId },
      relations: ['student', 'course'],
    });
  }

  async countByStatus(status: EnrollmentStatus): Promise<number> {
    return await this.repository.count({ where: { status } });
  }

  async countByCourse(courseId: string): Promise<number> {
    return await this.repository.count({ where: { courseId } });
  }

  async countByStudent(studentId: string): Promise<number> {
    return await this.repository.count({ where: { studentId } });
  }

  async findRecent(limit: number = 5): Promise<Enrollment[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['student', 'course'],
    });
  }

  async getEnrollmentStats(): Promise<{
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
  }> {
    const [pending, active, completed, cancelled] = await Promise.all([
      this.countByStatus(EnrollmentStatus.PENDING),
      this.countByStatus(EnrollmentStatus.ACTIVE),
      this.countByStatus(EnrollmentStatus.COMPLETED),
      this.countByStatus(EnrollmentStatus.CANCELLED),
    ]);

    const total = pending + active + completed + cancelled;

    return { total, pending, active, completed, cancelled };
  }
}

