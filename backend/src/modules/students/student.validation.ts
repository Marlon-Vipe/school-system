import Joi from 'joi';

export const createStudentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required',
  }),
  lastName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 100 characters',
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number',
  }),
  dateOfBirth: Joi.date().max('now').optional().messages({
    'date.max': 'Date of birth cannot be in the future',
  }),
  address: Joi.string().max(500).optional().messages({
    'string.max': 'Address must not exceed 500 characters',
  }),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional().default('active'),
  courseId: Joi.string().uuid().optional().messages({
    'string.guid': 'Course ID must be a valid UUID',
  }),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  lastName: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).optional().allow(''),
  dateOfBirth: Joi.date().max('now').optional().allow(null),
  address: Joi.string().max(500).optional().allow(''),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  courseId: Joi.string().uuid().optional().allow(null),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const getStudentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  courseId: Joi.string().uuid().optional(),
  sortBy: Joi.string().valid('name', 'lastName', 'email', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
});

export const studentParamsSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Student ID must be a valid UUID',
    'any.required': 'Student ID is required',
  }),
});



