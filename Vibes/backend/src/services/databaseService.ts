import admin from 'firebase-admin'
import { logger } from '../utils/logger'
import { Resume, JobDescription, ResumeVersion, OptimizationResult } from '../types'

class DatabaseService {
  private db: admin.firestore.Firestore | null = null

  constructor() {
    this.initializeFirebase()
  }

  private initializeFirebase() {
    try {
      if (!admin.apps.length) {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          clientId: process.env.FIREBASE_CLIENT_ID,
          authUri: process.env.FIREBASE_AUTH_URI,
          tokenUri: process.env.FIREBASE_TOKEN_URI,
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        })
      }

      this.db = admin.firestore()
      logger.info('Firebase initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize Firebase', {
        error: (error as Error).message,
      })
      // In development, continue without Firebase
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Running in development mode without Firebase')
      } else {
        throw error
      }
    }
  }

  // Resume operations
  async saveResume(resume: Resume): Promise<void> {
    if (!this.db) {
      logger.warn('Database not available, skipping save')
      return
    }

    try {
      await this.db.collection('resumes').doc(resume.id).set(resume)
      logger.info('Resume saved to database', { resumeId: resume.id })
    } catch (error) {
      logger.error('Failed to save resume', {
        error: (error as Error).message,
        resumeId: resume.id,
      })
      throw error
    }
  }

  async getResume(resumeId: string): Promise<Resume | null> {
    if (!this.db) {
      logger.warn('Database not available, returning null')
      return null
    }

    try {
      const doc = await this.db.collection('resumes').doc(resumeId).get()
      return doc.exists ? (doc.data() as Resume) : null
    } catch (error) {
      logger.error('Failed to get resume', {
        error: (error as Error).message,
        resumeId,
      })
      throw error
    }
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    if (!this.db) {
      logger.warn('Database not available, returning empty array')
      return []
    }

    try {
      const snapshot = await this.db
        .collection('resumes')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get()

      return snapshot.docs.map(doc => doc.data() as Resume)
    } catch (error) {
      logger.error('Failed to get user resumes', {
        error: (error as Error).message,
        userId,
      })
      throw error
    }
  }

  async deleteResume(resumeId: string): Promise<void> {
    if (!this.db) {
      logger.warn('Database not available, skipping delete')
      return
    }

    try {
      // Delete resume and all associated versions
      await this.db.collection('resumes').doc(resumeId).delete()
      
      // Delete associated versions
      const versionsSnapshot = await this.db
        .collection('resumeVersions')
        .where('resumeId', '==', resumeId)
        .get()

      const batch = this.db.batch()
      versionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      await batch.commit()

      logger.info('Resume deleted from database', { resumeId })
    } catch (error) {
      logger.error('Failed to delete resume', {
        error: (error as Error).message,
        resumeId,
      })
      throw error
    }
  }

  // Job description operations
  async saveJobDescription(jobDescription: JobDescription): Promise<void> {
    if (!this.db) {
      logger.warn('Database not available, skipping save')
      return
    }

    try {
      await this.db.collection('jobDescriptions').doc(jobDescription.id).set(jobDescription)
      logger.info('Job description saved to database', { jobDescriptionId: jobDescription.id })
    } catch (error) {
      logger.error('Failed to save job description', {
        error: (error as Error).message,
        jobDescriptionId: jobDescription.id,
      })
      throw error
    }
  }

  async getJobDescription(jobDescriptionId: string): Promise<JobDescription | null> {
    if (!this.db) {
      logger.warn('Database not available, returning null')
      return null
    }

    try {
      const doc = await this.db.collection('jobDescriptions').doc(jobDescriptionId).get()
      return doc.exists ? (doc.data() as JobDescription) : null
    } catch (error) {
      logger.error('Failed to get job description', {
        error: (error as Error).message,
        jobDescriptionId,
      })
      throw error
    }
  }

  // Resume version operations
  async saveResumeVersion(version: ResumeVersion): Promise<void> {
    if (!this.db) {
      logger.warn('Database not available, skipping save')
      return
    }

    try {
      await this.db.collection('resumeVersions').doc(version.id).set(version)
      logger.info('Resume version saved to database', { versionId: version.id })
    } catch (error) {
      logger.error('Failed to save resume version', {
        error: (error as Error).message,
        versionId: version.id,
      })
      throw error
    }
  }

  async getResumeVersion(versionId: string): Promise<ResumeVersion | null> {
    if (!this.db) {
      logger.warn('Database not available, returning null')
      return null
    }

    try {
      const doc = await this.db.collection('resumeVersions').doc(versionId).get()
      return doc.exists ? (doc.data() as ResumeVersion) : null
    } catch (error) {
      logger.error('Failed to get resume version', {
        error: (error as Error).message,
        versionId,
      })
      throw error
    }
  }

  async getUserResumeVersions(userId: string): Promise<ResumeVersion[]> {
    if (!this.db) {
      logger.warn('Database not available, returning empty array')
      return []
    }

    try {
      // Get all resume versions for user's resumes
      const resumes = await this.getUserResumes(userId)
      const resumeIds = resumes.map(r => r.id)

      if (resumeIds.length === 0) {
        return []
      }

      const snapshot = await this.db
        .collection('resumeVersions')
        .where('resumeId', 'in', resumeIds)
        .orderBy('createdAt', 'desc')
        .get()

      return snapshot.docs.map(doc => doc.data() as ResumeVersion)
    } catch (error) {
      logger.error('Failed to get user resume versions', {
        error: (error as Error).message,
        userId,
      })
      throw error
    }
  }

  // Optimization result operations
  async saveOptimizationResult(result: OptimizationResult): Promise<void> {
    if (!this.db) {
      logger.warn('Database not available, skipping save')
      return
    }

    try {
      await this.db.collection('optimizationResults').doc(result.id).set(result)
      logger.info('Optimization result saved to database', { optimizationId: result.id })
    } catch (error) {
      logger.error('Failed to save optimization result', {
        error: (error as Error).message,
        optimizationId: result.id,
      })
      throw error
    }
  }
}

export const databaseService = new DatabaseService()
