import { Router } from 'express'
import { analyzeJobController } from '../controllers/analyzeJobController'
import { validateAnalyzeJob } from '../middleware/validation'

const router = Router()

// POST /api/analyzeJob
router.post('/', validateAnalyzeJob, analyzeJobController.analyzeJob)

export { router as analyzeJobRouter }
