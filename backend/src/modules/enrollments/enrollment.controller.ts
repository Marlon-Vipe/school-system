import { Request, Response, NextFunction } from 'express';
import { EnrollmentService } from './enrollment.service';
import { AppError } from '../../utils/appError';
import { ApiResponse, PaginationQuery, EnrollmentFilters } from '../../types/common';

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor() {
    this.enrollmentService = new EnrollmentService();
  }

  createEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const enrollment = await this.enrollmentService.createEnrollment(req.body);

      const response: ApiResponse = {
        success: true,
        data: enrollment,
        message: 'Enrollment created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getEnrollmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const enrollment = await this.enrollmentService.getEnrollmentById(id);

      const response: ApiResponse = {
        success: true,
        data: enrollment,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      };

      const filters: EnrollmentFilters = {
        status: req.query.status as any,
        studentId: req.query.studentId as string,
        courseId: req.query.courseId as string,
      };

      const result = await this.enrollmentService.getEnrollments(pagination, filters);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Enrollments retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const enrollment = await this.enrollmentService.updateEnrollment(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: enrollment,
        message: 'Enrollment updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      await this.enrollmentService.deleteEnrollment(id);

      const response: ApiResponse = {
        success: true,
        message: 'Enrollment deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getEnrollmentStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.enrollmentService.getEnrollmentStats();

      const response: ApiResponse = {
        success: true,
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getRecentEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const enrollments = await this.enrollmentService.getRecentEnrollments(limit);

      const response: ApiResponse = {
        success: true,
        data: enrollments,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getEnrollmentsByStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { studentId } = req.params;
      const enrollments = await this.enrollmentService.getEnrollmentsByStudent(studentId);

      const response: ApiResponse = {
        success: true,
        data: enrollments,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getEnrollmentsByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const enrollments = await this.enrollmentService.getEnrollmentsByCourse(courseId);

      const response: ApiResponse = {
        success: true,
        data: enrollments,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  approveEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const enrollment = await this.enrollmentService.approveEnrollment(id);

      const response: ApiResponse = {
        success: true,
        data: enrollment,
        message: 'Enrollment approved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  completeEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { finalGrade, notes } = req.body;
      const enrollment = await this.enrollmentService.completeEnrollment(id, finalGrade, notes);

      const response: ApiResponse = {
        success: true,
        data: enrollment,
        message: 'Enrollment completed successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  cancelEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const enrollment = await this.enrollmentService.cancelEnrollment(id, notes);

      const response: ApiResponse = {
        success: true,
        data: enrollment,
        message: 'Enrollment cancelled successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}



