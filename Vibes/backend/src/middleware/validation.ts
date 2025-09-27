import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

// Validation schemas
const uploadSchema = Joi.object({
  resume: Joi.any().required().messages({
    'any.required': 'Resume file is required',
  }),
})

const analyzeJobSchema = Joi.object({
  url: Joi.string().uri().optional(),
  content: Joi.string().min(10).optional(),
}).or('url', 'content').messages({
  'object.missing': 'Either URL or content must be provided',
})

const optimizeResumeSchema = Joi.object({
  resumeId: Joi.string().required(),
  jobDescriptionId: Joi.string().required(),
})

// Validation middleware functions
export const validateUpload = (req: Request, res: Response, next: NextFunction) => {
  const { error } = uploadSchema.validate(req)
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    })
  }
  
  next()
}

export const validateAnalyzeJob = (req: Request, res: Response, next: NextFunction) => {
  const { error } = analyzeJobSchema.validate(req.body)
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    })
  }
  
  next()
}

export const validateOptimizeResume = (req: Request, res: Response, next: NextFunction) => {
  const { error } = optimizeResumeSchema.validate(req.body)
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    })
  }
  
  next()
}
