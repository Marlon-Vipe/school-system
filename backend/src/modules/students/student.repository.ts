import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Student, StudentStatus } from './student.entity';
import { PaginationQuery, StudentFilters } from '../../types/common';

export class StudentRepository {
  private repository: Repository<Student>;

  constructor() {
    this.repository = AppDataSource.getRepository(Student);
  }

  async create(studentData: Partial<Student>): Promise<Student> {
    const student = this.repository.create(studentData);
    return await this.repository.save(student);
  }

  async findById(id: string): Promise<Student | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['course', 'enrollments'],
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async findAll(
    pagination: PaginationQuery,
    filters: StudentFilters = {}
  ): Promise<{ students: Student[]; total: number }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const { status, courseId } = filters;

    const queryBuilder = this.repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.course', 'course')
      .leftJoinAndSelect('student.enrollments', 'enrollments');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(student.name ILIKE :search OR student.lastName ILIKE :search OR student.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('student.status = :status', { status });
    }

    if (courseId) {
      queryBuilder.andWhere('student.courseId = :courseId', { courseId });
    }

    // Apply sorting
    queryBuilder.orderBy(`student.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [students, total] = await queryBuilder.getManyAndCount();

    return { students, total };
  }

  async update(id: string, updateData: Partial<Student>): Promise<Student | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { 
      status: StudentStatus.INACTIVE 
    });
    return result.affected !== 0;
  }

  async countByStatus(status: StudentStatus): Promise<number> {
    return await this.repository.count({ where: { status } });
  }

  async countByCourse(courseId: string): Promise<number> {
    return await this.repository.count({ where: { courseId } });
  }

  async findRecent(limit: number = 5): Promise<Student[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['course'],
    });
  }
}



