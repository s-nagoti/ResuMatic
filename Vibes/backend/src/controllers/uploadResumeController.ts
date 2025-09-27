import { Request, Response } from 'express'
import { uploadResumeService } from '../services/uploadResumeService'
import { logger } from '../utils/logger'

class UploadResumeController {
  async uploadResume(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        })
      }

      logger.info('Processing resume upload', {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
      })

      // TODO: Get user ID from authentication middleware
      const userId = 'temp-user-id' // This should come from auth middleware

      const result = await uploadResumeService.processResume(req.file, userId)

      logger.info('Resume uploaded successfully', {
        resumeId: result.resumeId,
        fileName: result.fileName,
      })

      res.status(201).json({
        success: true,
        data: result,
        message: 'Resume uploaded and parsed successfully',
      })
    } catch (error) {
      logger.error('Failed to upload resume', { error: (error as Error).message })
      
      res.status(500).json({
        success: false,
        error: 'Failed to process resume upload',
      })
    }
  }
}

export const uploadResumeController = new UploadResumeController()
