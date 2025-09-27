import { v4 as uuidv4 } from 'uuid'
import { jobScrapingService } from './jobScrapingService'
import { aiService } from './aiService'
import { databaseService } from './databaseService'
import { logger } from '../utils/logger'
import { AnalyzeJobRequest, AnalyzeJobResponse } from '../types'

class AnalyzeJobService {
  async analyzeJobDescription(
    request: AnalyzeJobRequest,
    userId: string
  ): Promise<AnalyzeJobResponse> {
    try {
      let jobContent: string

      // Extract job content from URL or use provided content
      if (request.url) {
        logger.info('Scraping job description from URL', { url: request.url })
        jobContent = await jobScrapingService.scrapeJobDescription(request.url)
      } else {
        jobContent = request.content!
      }

      // Use AI to analyze the job description
      logger.info('Analyzing job description with AI', {
        contentLength: jobContent.length,
      })
      
      const analysis = await aiService.analyzeJobDescription(jobContent)

      // Generate unique job description ID
      const jobDescriptionId = uuidv4()

      // Save job description to database
      const jobData = {
        id: jobDescriptionId,
        userId,
        title: analysis.title,
        company: analysis.company,
        content: jobContent,
        url: request.url,
        extractedKeywords: analysis.keywords,
        requiredSkills: analysis.skills,
        experienceLevel: analysis.experienceLevel,
        createdAt: new Date(),
      }

      await databaseService.saveJobDescription(jobData)

      logger.info('Job description analyzed successfully', {
        jobDescriptionId,
        title: analysis.title,
        company: analysis.company,
        keywordsCount: analysis.keywords.length,
      })

      return {
        jobDescriptionId,
        title: analysis.title,
        company: analysis.company,
        keywords: analysis.keywords,
        skills: analysis.skills,
        experienceLevel: analysis.experienceLevel,
      }
    } catch (error) {
      logger.error('Failed to analyze job description', {
        error: (error as Error).message,
        hasUrl: !!request.url,
        hasContent: !!request.content,
      })
      throw error
    }
  }
}

export const analyzeJobService = new AnalyzeJobService()
