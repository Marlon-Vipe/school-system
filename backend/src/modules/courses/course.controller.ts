import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/appError';
import { ApiResponse } from '../../types/common';
import { CourseService } from './course.service';

export class CourseController {
  private courseService = new CourseService();

  getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courses = await this.courseService.getAllCourses();
      
      const response: ApiResponse<typeof courses> = {
        success: true,
        message: 'Courses retrieved successfully',
        data: courses
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw AppError.badRequest('Course ID is required');
      }
      
      const course = await this.courseService.getCourseById(id);
      
      const response: ApiResponse<typeof course> = {
        success: true,
        message: 'Course retrieved successfully',
        data: course
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseData = req.body;
      
      const course = await this.courseService.createCourse(courseData);
      
      const response: ApiResponse<typeof course> = {
        success: true,
        message: 'Course created successfully',
        data: course
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        throw AppError.badRequest('Course ID is required');
      }
      
      const course = await this.courseService.updateCourse(id, updateData);
      
      const response: ApiResponse<typeof course> = {
        success: true,
        message: 'Course updated successfully',
        data: course
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw AppError.badRequest('Course ID is required');
      }
      
      await this.courseService.deleteCourse(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'Course deleted successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}



