import Joi from 'joi';

// Validation schema for creating a course
export const createCourseSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Course name must be at least 3 characters long',
      'string.max': 'Course name must not exceed 200 characters',
      'any.required': 'Course name is required'
    }),
  
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  
  code: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Z0-9-_]+$/)
    .required()
    .messages({
      'string.min': 'Course code must be at least 2 characters long',
      'string.max': 'Course code must not exceed 50 characters',
      'string.pattern.base': 'Course code must contain only uppercase letters, numbers, hyphens, and underscores',
      'any.required': 'Course code is required'
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required'
    }),
  
  duration: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'Duration must be an integer',
      'number.min': 'Duration must be a positive number or zero'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive', 'draft')
    .optional()
    .default('active')
    .messages({
      'any.only': 'Status must be one of: active, inactive, draft'
    }),
  
  category: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Category must not exceed 100 characters'
    }),
  
  maxStudents: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'Max students must be an integer',
      'number.min': 'Max students must be a positive number or zero'
    }),
  
  startDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Start date must be a valid date'
    }),
  
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date'
    })
});

// Validation schema for updating a course
export const updateCourseSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Course name must be at least 3 characters long',
      'string.max': 'Course name must not exceed 200 characters'
    }),
  
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  
  code: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Z0-9-_]+$/)
    .optional()
    .messages({
      'string.min': 'Course code must be at least 2 characters long',
      'string.max': 'Course code must not exceed 50 characters',
      'string.pattern.base': 'Course code must contain only uppercase letters, numbers, hyphens, and underscores'
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Price must be a positive number'
    }),
  
  duration: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Duration must be an integer',
      'number.min': 'Duration must be a positive number or zero'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive', 'draft')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, draft'
    }),
  
  category: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Category must not exceed 100 characters'
    }),
  
  maxStudents: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Max students must be an integer',
      'number.min': 'Max students must be a positive number or zero'
    }),
  
  startDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Start date must be a valid date'
    }),
  
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date'
    })
});

// Validation schema for course ID parameter
export const courseIdSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Course ID must be a valid UUID',
      'any.required': 'Course ID is required'
    })
});
