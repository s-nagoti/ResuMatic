import { Request, Response } from 'express'
import { analyzeJobService } from '../services/analyzeJobService'
import { logger } from '../utils/logger'

class AnalyzeJobController {
  async analyzeJob(req: Request, res: Response) {
    try {
      const { url, content } = req.body

      logger.info('Processing job analysis', {
        hasUrl: !!url,
        hasContent: !!content,
        contentLength: content?.length || 0,
      })

      // TODO: Get user ID from authentication middleware
      const userId = 'temp-user-id' // This should come from auth middleware

      const result = await analyzeJobService.analyzeJobDescription(
        { url, content },
        userId
      )

      logger.info('Job analysis completed', {
        jobDescriptionId: result.jobDescriptionId,
        title: result.title,
        company: result.company,
        keywordsCount: result.keywords.length,
      })

      res.json({
        success: true,
        data: result,
        message: 'Job description analyzed successfully',
      })
    } catch (error) {
      logger.error('Failed to analyze job description', { 
        error: (error as Error).message 
      })
      
      res.status(500).json({
        success: false,
        error: 'Failed to analyze job description',
      })
    }
  }
}

export const analyzeJobController = new AnalyzeJobController()
