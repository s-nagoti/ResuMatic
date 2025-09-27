import { Request, Response } from 'express'
import { optimizeResumeService } from '../services/optimizeResumeService'
import { logger } from '../utils/logger'

class OptimizeResumeController {
  async optimizeResume(req: Request, res: Response) {
    try {
      const { resumeId, jobDescriptionId } = req.body

      logger.info('Processing resume optimization', {
        resumeId,
        jobDescriptionId,
      })

      // TODO: Get user ID from authentication middleware
      const userId = 'temp-user-id' // This should come from auth middleware

      const result = await optimizeResumeService.optimizeResume(
        resumeId,
        jobDescriptionId,
        userId
      )

      logger.info('Resume optimization completed', {
        optimizationId: result.optimizationId,
        score: result.score,
        suggestionsCount: result.suggestions.length,
      })

      res.json({
        success: true,
        data: result,
        message: 'Resume optimized successfully',
      })
    } catch (error) {
      logger.error('Failed to optimize resume', { 
        error: (error as Error).message 
      })
      
      res.status(500).json({
        success: false,
        error: 'Failed to optimize resume',
      })
    }
  }
}

export const optimizeResumeController = new OptimizeResumeController()
