import { Request, Response, NextFunction } from 'express';
import { StudentService } from './student.service';
import { AppError } from '../../utils/appError';
import { ApiResponse, PaginationQuery, StudentFilters } from '../../types/common';

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  createStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const student = await this.studentService.createStudent(req.body);

      const response: ApiResponse = {
        success: true,
        data: student,
        message: 'Student created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getStudentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const student = await this.studentService.getStudentById(id);

      const response: ApiResponse = {
        success: true,
        data: student,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      };

      const filters: StudentFilters = {
        status: req.query.status as any,
        courseId: req.query.courseId as string,
      };

      const result = await this.studentService.getStudents(pagination, filters);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Students retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const student = await this.studentService.updateStudent(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: student,
        message: 'Student updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const softDelete = req.query.soft !== 'false'; // Default to soft delete

      await this.studentService.deleteStudent(id, softDelete);

      const response: ApiResponse = {
        success: true,
        message: softDelete ? 'Student deactivated successfully' : 'Student deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getStudentStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.studentService.getStudentStats();

      const response: ApiResponse = {
        success: true,
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getRecentStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const students = await this.studentService.getRecentStudents(limit);

      const response: ApiResponse = {
        success: true,
        data: students,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getStudentsByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const students = await this.studentService.getStudentsByCourse(courseId);

      const response: ApiResponse = {
        success: true,
        data: students,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
