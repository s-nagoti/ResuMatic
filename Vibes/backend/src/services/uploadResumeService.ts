import { v4 as uuidv4 } from 'uuid'
import { parseResumeService } from './parseResumeService'
import { databaseService } from './databaseService'
import { logger } from '../utils/logger'
import { UploadResponse } from '../types'

class UploadResumeService {
  async processResume(file: Express.Multer.File, userId: string): Promise<UploadResponse> {
    try {
      // Generate unique resume ID
      const resumeId = uuidv4()
      
      // Parse resume content based on file type
      const parsedContent = await parseResumeService.parseFile(file)
      
      // Save resume to database
      const resumeData = {
        id: resumeId,
        userId,
        originalFileName: file.originalname,
        fileUrl: file.path, // In production, this should be a cloud storage URL
        fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'docx',
        parsedContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await databaseService.saveResume(resumeData)

      logger.info('Resume processed successfully', {
        resumeId,
        fileName: file.originalname,
        contentLength: parsedContent.length,
      })

      return {
        resumeId,
        fileName: file.originalname,
        parsedContent,
      }
    } catch (error) {
      logger.error('Failed to process resume', {
        error: (error as Error).message,
        fileName: file.originalname,
      })
      throw error
    }
  }
}

export const uploadResumeService = new UploadResumeService()
