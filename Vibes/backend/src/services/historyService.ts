import { databaseService } from './databaseService'
import { logger } from '../utils/logger'

class HistoryService {
  async getUserHistory(userId: string) {
    try {
      logger.info('Fetching user history', { userId })

      // Get all resumes and their versions for the user
      const resumes = await databaseService.getUserResumes(userId)
      const versions = await databaseService.getUserResumeVersions(userId)

      return {
        resumes,
        versions,
      }
    } catch (error) {
      logger.error('Failed to fetch user history', {
        error: (error as Error).message,
        userId,
      })
      throw error
    }
  }

  async getResumeVersion(versionId: string) {
    try {
      logger.info('Fetching resume version', { versionId })

      const version = await databaseService.getResumeVersion(versionId)
      
      if (!version) {
        throw new Error('Resume version not found')
      }

      return version
    } catch (error) {
      logger.error('Failed to fetch resume version', {
        error: (error as Error).message,
        versionId,
      })
      throw error
    }
  }

  async deleteResume(resumeId: string) {
    try {
      logger.info('Deleting resume', { resumeId })

      // Delete resume and all associated versions
      await databaseService.deleteResume(resumeId)

      logger.info('Resume deleted successfully', { resumeId })
    } catch (error) {
      logger.error('Failed to delete resume', {
        error: (error as Error).message,
        resumeId,
      })
      throw error
    }
  }
}

export const historyService = new HistoryService()
