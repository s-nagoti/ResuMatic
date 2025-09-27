import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { logger } from '../utils/logger'

class ParseResumeService {
  async parseFile(file: Express.Multer.File): Promise<string> {
    try {
      logger.info('Parsing resume file', {
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
      })

      let content: string

      if (file.mimetype === 'application/pdf') {
        content = await this.parsePDF(file.buffer)
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        content = await this.parseDOCX(file.buffer)
      } else {
        throw new Error('Unsupported file type')
      }

      // Clean and normalize the content
      content = this.cleanContent(content)

      logger.info('Resume parsed successfully', {
        fileName: file.originalname,
        contentLength: content.length,
      })

      return content
    } catch (error) {
      logger.error('Failed to parse resume file', {
        error: (error as Error).message,
        fileName: file.originalname,
        fileType: file.mimetype,
      })
      throw error
    }
  }

  private async parsePDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer)
      return data.text
    } catch (error) {
      logger.error('Failed to parse PDF', { error: (error as Error).message })
      throw new Error('Failed to parse PDF file')
    }
  }

  private async parseDOCX(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    } catch (error) {
      logger.error('Failed to parse DOCX', { error: (error as Error).message })
      throw new Error('Failed to parse DOCX file')
    }
  }

  private cleanContent(content: string): string {
    // Remove extra whitespace and normalize line breaks
    return content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim()
  }
}

export const parseResumeService = new ParseResumeService()
