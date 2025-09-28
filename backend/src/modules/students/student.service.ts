import { StudentRepository } from './student.repository';
import { Student, StudentStatus } from './student.entity';
import { AppError } from '../../utils/appError';
import { PaginationQuery, StudentFilters, PaginationResult } from '../../types/common';

export class StudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async createStudent(studentData: Partial<Student>): Promise<Student> {
    // Check if email already exists
    const existingStudent = await this.studentRepository.findByEmail(studentData.email!);
    if (existingStudent) {
      throw AppError.conflict('A student with this email already exists');
    }

    // Set default status if not provided
    if (!studentData.status) {
      studentData.status = StudentStatus.ACTIVE;
    }

    return await this.studentRepository.create(studentData);
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw AppError.notFound('Student not found');
    }
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    const { students } = await this.studentRepository.findAll(
      { page: 1, limit: 1000 }, // Get all students with a high limit
      {}
    );
    return students;
  }

  async getStudents(
    pagination: PaginationQuery,
    filters: StudentFilters = {}
  ): Promise<PaginationResult<Student>> {
    const { students, total } = await this.studentRepository.findAll(pagination, filters);
    
    const { page = 1, limit = 10 } = pagination;
    const totalPages = Math.ceil(total / limit);

    return {
      data: students,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async updateStudent(id: string, updateData: Partial<Student>): Promise<Student> {
    // Check if student exists
    const existingStudent = await this.studentRepository.findById(id);
    if (!existingStudent) {
      throw AppError.notFound('Student not found');
    }

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== existingStudent.email) {
      const emailExists = await this.studentRepository.findByEmail(updateData.email);
      if (emailExists) {
        throw AppError.conflict('A student with this email already exists');
      }
    }

    const updatedStudent = await this.studentRepository.update(id, updateData);
    if (!updatedStudent) {
      throw AppError.internal('Failed to update student');
    }

    return updatedStudent;
  }

  async deleteStudent(id: string, softDelete: boolean = true): Promise<void> {
    const existingStudent = await this.studentRepository.findById(id);
    if (!existingStudent) {
      throw AppError.notFound('Student not found');
    }

    if (softDelete) {
      const success = await this.studentRepository.softDelete(id);
      if (!success) {
        throw AppError.internal('Failed to deactivate student');
      }
    } else {
      const success = await this.studentRepository.delete(id);
      if (!success) {
        throw AppError.internal('Failed to delete student');
      }
    }
  }

  async getStudentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  }> {
    const [active, inactive, suspended] = await Promise.all([
      this.studentRepository.countByStatus(StudentStatus.ACTIVE),
      this.studentRepository.countByStatus(StudentStatus.INACTIVE),
      this.studentRepository.countByStatus(StudentStatus.SUSPENDED),
    ]);

    const total = active + inactive + suspended;

    return { total, active, inactive, suspended };
  }

  async getRecentStudents(limit: number = 5): Promise<Student[]> {
    return await this.studentRepository.findRecent(limit);
  }

  async getStudentsByCourse(courseId: string): Promise<Student[]> {
    const { students } = await this.studentRepository.findAll(
      { page: 1, limit: 1000 },
      { courseId }
    );
    return students;
  }
}



