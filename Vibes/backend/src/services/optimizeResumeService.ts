import { v4 as uuidv4 } from 'uuid'
import { aiService } from './aiService'
import { databaseService } from './databaseService'
import { logger } from '../utils/logger'
import { OptimizeResumeResponse } from '../types'

class OptimizeResumeService {
  async optimizeResume(
    resumeId: string,
    jobDescriptionId: string,
    userId: string
  ): Promise<OptimizeResumeResponse> {
    try {
      // Get resume and job description from database
      const resume = await databaseService.getResume(resumeId)
      const jobDescription = await databaseService.getJobDescription(jobDescriptionId)

      if (!resume) {
        throw new Error('Resume not found')
      }

      if (!jobDescription) {
        throw new Error('Job description not found')
      }

      logger.info('Starting resume optimization', {
        resumeId,
        jobDescriptionId,
        resumeContentLength: resume.parsedContent.length,
        jobContentLength: jobDescription.content.length,
      })

      // Use AI to optimize the resume
      const optimization = await aiService.optimizeResume(
        resume.parsedContent,
        jobDescription.content,
        jobDescription.extractedKeywords,
        jobDescription.requiredSkills
      )

      // Generate unique optimization ID
      const optimizationId = uuidv4()

      // Save optimization result to database
      const optimizationData = {
        id: optimizationId,
        resumeId,
        jobDescriptionId,
        score: optimization.score,
        suggestions: optimization.suggestions,
        keywordCoverage: optimization.keywordCoverage,
        createdAt: new Date(),
      }

      await databaseService.saveOptimizationResult(optimizationData)

      // Create new resume version with optimizations applied
      const newVersion = await this.createOptimizedVersion(
        resumeId,
        optimization.suggestions,
        jobDescriptionId
      )

      logger.info('Resume optimization completed', {
        optimizationId,
        score: optimization.score,
        suggestionsCount: optimization.suggestions.length,
        newVersionId: newVersion.id,
      })

      return {
        optimizationId,
        suggestions: optimization.suggestions,
        keywordCoverage: optimization.keywordCoverage,
        score: optimization.score,
      }
    } catch (error) {
      logger.error('Failed to optimize resume', {
        error: (error as Error).message,
        resumeId,
        jobDescriptionId,
      })
      throw error
    }
  }

  private async createOptimizedVersion(
    resumeId: string,
    suggestions: any[],
    jobDescriptionId: string
  ) {
    // TODO: Implement version creation logic
    // This would apply the AI suggestions to create a new resume version
    const versionId = uuidv4()
    
    // For now, return a placeholder
    return {
      id: versionId,
      resumeId,
      versionNumber: 1,
      content: '', // This would be the optimized content
      changes: suggestions.map(s => ({
        type: s.type,
        section: s.section,
        originalText: s.currentText,
        newText: s.suggestedText,
        reason: s.reason,
      })),
      jobDescriptionId,
      createdAt: new Date(),
    }
  }
}

export const optimizeResumeService = new OptimizeResumeService()
