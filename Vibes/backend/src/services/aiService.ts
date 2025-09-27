import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import { logger } from '../utils/logger'

class AIService {
  private gemini: GoogleGenerativeAI | null = null
  private openai: OpenAI | null = null

  constructor() {
    // Initialize Gemini API
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }

    // Initialize OpenAI API as fallback
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }
  }

  async analyzeJobDescription(content: string) {
    try {
      logger.info('Analyzing job description with AI', {
        contentLength: content.length,
      })

      const prompt = `
        Analyze this job description and extract the following information:
        
        1. Job title
        2. Company name
        3. Key skills and technologies mentioned
        4. Required keywords
        5. Experience level (entry, mid, senior, executive)
        
        Job Description:
        ${content}
        
        Please respond in JSON format with the following structure:
        {
          "title": "Job Title",
          "company": "Company Name",
          "keywords": ["keyword1", "keyword2", "keyword3"],
          "skills": ["skill1", "skill2", "skill3"],
          "experienceLevel": "mid"
        }
      `

      const response = await this.callAI(prompt)
      
      // Parse the JSON response
      const analysis = JSON.parse(response)
      
      logger.info('Job description analysis completed', {
        title: analysis.title,
        company: analysis.company,
        keywordsCount: analysis.keywords?.length || 0,
        skillsCount: analysis.skills?.length || 0,
      })

      return analysis
    } catch (error) {
      logger.error('Failed to analyze job description', {
        error: (error as Error).message,
      })
      throw error
    }
  }

  async optimizeResume(
    resumeContent: string,
    jobDescription: string,
    keywords: string[],
    skills: string[]
  ) {
    try {
      logger.info('Optimizing resume with AI', {
        resumeLength: resumeContent.length,
        jobLength: jobDescription.length,
        keywordsCount: keywords.length,
        skillsCount: skills.length,
      })

      const prompt = `
        Analyze this resume and job description to provide optimization suggestions.
        
        Resume Content:
        ${resumeContent}
        
        Job Description:
        ${jobDescription}
        
        Key Keywords to Include: ${keywords.join(', ')}
        Required Skills: ${skills.join(', ')}
        
        Please provide specific suggestions to optimize the resume for this job, including:
        1. Keywords to add or emphasize
        2. Skills to highlight
        3. Experience to reframe
        4. Missing elements to add
        
        Respond in JSON format with this structure:
        {
          "score": 85,
          "suggestions": [
            {
              "type": "add",
              "section": "skills",
              "currentText": "",
              "suggestedText": "Python, JavaScript, React",
              "reason": "These skills are mentioned in the job description",
              "priority": "high"
            }
          ],
          "keywordCoverage": [
            {
              "keyword": "Python",
              "found": true,
              "count": 3,
              "locations": ["skills", "experience"],
              "importance": "high"
            }
          ]
        }
      `

      const response = await this.callAI(prompt)
      const optimization = JSON.parse(response)

      logger.info('Resume optimization completed', {
        score: optimization.score,
        suggestionsCount: optimization.suggestions?.length || 0,
      })

      return optimization
    } catch (error) {
      logger.error('Failed to optimize resume', {
        error: (error as Error).message,
      })
      throw error
    }
  }

  private async callAI(prompt: string): Promise<string> {
    // Try Gemini first, fallback to OpenAI
    if (this.gemini) {
      try {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
      } catch (error) {
        logger.warn('Gemini API failed, trying OpenAI fallback', {
          error: (error as Error).message,
        })
      }
    }

    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        })
        return completion.choices[0]?.message?.content || ''
      } catch (error) {
        logger.error('OpenAI API failed', {
          error: (error as Error).message,
        })
        throw new Error('AI service unavailable')
      }
    }

    throw new Error('No AI service configured')
  }
}

export const aiService = new AIService()
