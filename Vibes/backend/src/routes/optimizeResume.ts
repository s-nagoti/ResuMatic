import { Router } from 'express'
import { optimizeResumeController } from '../controllers/optimizeResumeController'
import { validateOptimizeResume } from '../middleware/validation'

const router = Router()

// POST /api/optimizeResume
router.post('/', validateOptimizeResume, optimizeResumeController.optimizeResume)

export { router as optimizeResumeRouter }
