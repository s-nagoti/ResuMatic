import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import { logger } from '../utils/logger'

class JobScrapingService {
  async scrapeJobDescription(url: string): Promise<string> {
    try {
      logger.info('Scraping job description', { url })

      // Launch Puppeteer browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()
      
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2' })
      
      // Get page content
      const content = await page.content()
      
      await browser.close()

      // Parse with Cheerio to extract job description
      const $ = cheerio.load(content)
      
      // Common selectors for job descriptions
      const jobDescriptionSelectors = [
        '.job-description',
        '.job-details',
        '.description',
        '.content',
        '[data-testid="job-description"]',
        '.jobsearch-jobDescriptionText',
        '.description__text',
        '.job-description-content',
      ]

      let jobDescription = ''

      // Try each selector until we find content
      for (const selector of jobDescriptionSelectors) {
        const element = $(selector)
        if (element.length > 0) {
          jobDescription = element.text().trim()
          if (jobDescription.length > 100) { // Ensure we have substantial content
            break
          }
        }
      }

      // Fallback: get all text content if specific selectors don't work
      if (!jobDescription || jobDescription.length < 100) {
        jobDescription = $('body').text().trim()
      }

      // Clean up the content
      jobDescription = this.cleanJobDescription(jobDescription)

      logger.info('Job description scraped successfully', {
        url,
        contentLength: jobDescription.length,
      })

      return jobDescription
    } catch (error) {
      logger.error('Failed to scrape job description', {
        error: (error as Error).message,
        url,
      })
      throw new Error('Failed to scrape job description from URL')
    }
  }

  private cleanJobDescription(content: string): string {
    // Remove extra whitespace and normalize
    return content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim()
  }
}

export const jobScrapingService = new JobScrapingService()
