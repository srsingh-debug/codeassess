import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { JobStatus, EmploymentType, WorkLocationType, JobPriority } from '../models/Job';

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: errors,
        },
      });
    }

    req.body = value;
    next();
  };
};

// Job creation/update schema
const requirementsSchema = Joi.object({
  minExperience: Joi.number().min(0).optional(),
  maxExperience: Joi.number().min(0).optional(),
  education: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  skills: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one skill is required',
    'any.required': 'Skills are required',
  }),
  languages: Joi.array().items(Joi.string()).optional(),
  visaSponsorship: Joi.boolean().optional(),
}).custom((value, helpers) => {
  if (value.maxExperience && value.minExperience && value.maxExperience < value.minExperience) {
    return helpers.error('any.invalid');
  }
  return value;
}).messages({
  'any.invalid': 'Max experience must be greater than or equal to min experience',
});

const compensationSchema = Joi.object({
  min: Joi.number().min(0).optional(),
  max: Joi.number().min(0).optional(),
  currency: Joi.string().uppercase().default('USD').when('min', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  period: Joi.string().valid('hourly', 'monthly', 'yearly').default('yearly').when('min', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  equity: Joi.number().optional(),
  benefits: Joi.array().items(Joi.string()).optional(),
}).custom((value, helpers) => {
  if (value.max && value.min && value.max < value.min) {
    return helpers.error('any.invalid');
  }
  return value;
}).messages({
  'any.invalid': 'Max compensation must be greater than or equal to min compensation',
});

const applicationSettingsSchema = Joi.object({
  requireCoverLetter: Joi.boolean().default(false),
  requirePortfolio: Joi.boolean().default(false),
  requireReferences: Joi.boolean().default(false),
  maxApplications: Joi.number().min(1).optional(),
  autoRejectThreshold: Joi.number().min(0).max(100).optional(),
  assessmentRequired: Joi.boolean().default(true),
  assessmentId: Joi.string().optional(),
});

export const jobSchemas = {
  create: Joi.object({
    title: Joi.string().trim().min(5).max(200).required().messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().min(100).required().messages({
      'string.min': 'Description must be at least 100 characters',
      'any.required': 'Description is required',
    }),
    shortDescription: Joi.string().max(500).optional(),
    location: Joi.string().trim().required().messages({
      'any.required': 'Location is required',
    }),
    workLocationType: Joi.string()
      .valid(...Object.values(WorkLocationType))
      .required()
      .messages({
        'any.only': 'Work location type must be one of: remote, onsite, hybrid',
        'any.required': 'Work location type is required',
      }),
    employmentType: Joi.string()
      .valid(...Object.values(EmploymentType))
      .required()
      .messages({
        'any.only': 'Employment type must be one of: full-time, part-time, contract, internship, temporary',
        'any.required': 'Employment type is required',
      }),
    requirements: requirementsSchema.required(),
    compensation: compensationSchema.optional(),
    applicationSettings: applicationSettingsSchema.default({
      requireCoverLetter: false,
      requirePortfolio: false,
      requireReferences: false,
      assessmentRequired: true,
    }),
    applicationDeadline: Joi.date().greater('now').optional().messages({
      'date.greater': 'Application deadline must be in the future',
    }),
    priority: Joi.string()
      .valid(...Object.values(JobPriority))
      .default(JobPriority.MEDIUM)
      .optional(),
    department: Joi.string().trim().optional(),
    team: Joi.string().trim().optional(),
    reportingTo: Joi.string().trim().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    internalNotes: Joi.string().optional(),
    companyInfo: Joi.object({
      name: Joi.string().optional(),
      website: Joi.string().uri().optional(),
      logo: Joi.string().uri().optional(),
    }).optional(),
  }),

  update: Joi.object({
    title: Joi.string().trim().min(5).max(200).optional(),
    description: Joi.string().min(100).optional(),
    shortDescription: Joi.string().max(500).optional(),
    location: Joi.string().trim().optional(),
    workLocationType: Joi.string()
      .valid(...Object.values(WorkLocationType))
      .optional(),
    employmentType: Joi.string()
      .valid(...Object.values(EmploymentType))
      .optional(),
    requirements: requirementsSchema.optional(),
    compensation: compensationSchema.optional(),
    applicationSettings: applicationSettingsSchema.optional(),
    applicationDeadline: Joi.date().greater('now').optional().messages({
      'date.greater': 'Application deadline must be in the future',
    }),
    priority: Joi.string()
      .valid(...Object.values(JobPriority))
      .optional(),
    department: Joi.string().trim().optional(),
    team: Joi.string().trim().optional(),
    reportingTo: Joi.string().trim().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    internalNotes: Joi.string().optional(),
    companyInfo: Joi.object({
      name: Joi.string().optional(),
      website: Joi.string().uri().optional(),
      logo: Joi.string().uri().optional(),
    }).optional(),
  }),

  approve: Joi.object({
    comments: Joi.string().optional(),
  }),

  reject: Joi.object({
    rejectionReason: Joi.string().min(10).required().messages({
      'string.min': 'Rejection reason must be at least 10 characters',
      'any.required': 'Rejection reason is required',
    }),
    comments: Joi.string().optional(),
  }),

  submit: Joi.object({}).empty(),
};

