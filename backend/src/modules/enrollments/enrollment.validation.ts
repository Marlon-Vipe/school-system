import Joi from 'joi';

export const createEnrollmentSchema = Joi.object({
  studentId: Joi.string().uuid().required().messages({
    'string.guid': 'Student ID must be a valid UUID',
    'any.required': 'Student ID is required',
  }),
  courseId: Joi.string().uuid().required().messages({
    'string.guid': 'Course ID must be a valid UUID',
    'any.required': 'Course ID is required',
  }),
  status: Joi.string().valid('pending', 'active', 'completed', 'cancelled').optional().default('pending'),
  enrolledAt: Joi.date().optional(),
  completedAt: Joi.date().optional(),
  finalGrade: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Final grade must be at least 0',
    'number.max': 'Final grade must be at most 100',
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Notes must not exceed 500 characters',
  }),
});

export const updateEnrollmentSchema = Joi.object({
  status: Joi.string().valid('pending', 'active', 'completed', 'cancelled').optional(),
  enrolledAt: Joi.date().optional().allow(null),
  completedAt: Joi.date().optional().allow(null),
  finalGrade: Joi.number().min(0).max(100).optional().allow(null).messages({
    'number.min': 'Final grade must be at least 0',
    'number.max': 'Final grade must be at most 100',
  }),
  notes: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Notes must not exceed 500 characters',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const getEnrollmentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional(),
  status: Joi.string().valid('pending', 'active', 'completed', 'cancelled').optional(),
  studentId: Joi.string().uuid().optional(),
  courseId: Joi.string().uuid().optional(),
  sortBy: Joi.string().valid('createdAt', 'enrolledAt', 'completedAt', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
});

export const enrollmentParamsSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Enrollment ID must be a valid UUID',
    'any.required': 'Enrollment ID is required',
  }),
});

export const studentParamsSchema = Joi.object({
  studentId: Joi.string().uuid().required().messages({
    'string.guid': 'Student ID must be a valid UUID',
    'any.required': 'Student ID is required',
  }),
});

export const courseParamsSchema = Joi.object({
  courseId: Joi.string().uuid().required().messages({
    'string.guid': 'Course ID must be a valid UUID',
    'any.required': 'Course ID is required',
  }),
});

export const completeEnrollmentSchema = Joi.object({
  finalGrade: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Final grade must be at least 0',
    'number.max': 'Final grade must be at most 100',
  }),
  notes: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Notes must not exceed 500 characters',
  }),
});

export const cancelEnrollmentSchema = Joi.object({
  notes: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Notes must not exceed 500 characters',
  }),
});

