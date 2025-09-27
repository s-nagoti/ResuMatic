import { Request, Response } from 'express'
import { historyService } from '../services/historyService'
import { logger } from '../utils/logger'

class HistoryController {
  async getHistory(req: Request, res: Response) {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = 'temp-user-id' // This should come from auth middleware

      logger.info('Fetching resume history', { userId })

      const result = await historyService.getUserHistory(userId)

      res.json({
        success: true,
        data: result,
        message: 'History retrieved successfully',
      })
    } catch (error) {
      logger.error('Failed to fetch history', { 
        error: (error as Error).message 
      })
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resume history',
      })
    }
  }

  async getResumeVersion(req: Request, res: Response) {
    try {
      const { versionId } = req.params

      logger.info('Fetching resume version', { versionId })

      const result = await historyService.getResumeVersion(versionId)

      res.json({
        success: true,
        data: result,
        message: 'Resume version retrieved successfully',
      })
    } catch (error) {
      logger.error('Failed to fetch resume version', { 
        error: (error as Error).message 
      })
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resume version',
      })
    }
  }

  async deleteResume(req: Request, res: Response) {
    try {
      const { resumeId } = req.params

      logger.info('Deleting resume', { resumeId })

      await historyService.deleteResume(resumeId)

      res.json({
        success: true,
        message: 'Resume deleted successfully',
      })
    } catch (error) {
      logger.error('Failed to delete resume', { 
        error: (error as Error).message 
      })
      
      res.status(500).json({
        success: false,
        error: 'Failed to delete resume',
      })
    }
  }
}

export const historyController = new HistoryController()
