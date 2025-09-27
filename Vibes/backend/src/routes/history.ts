import { Router } from 'express'
import { historyController } from '../controllers/historyController'

const router = Router()

// GET /api/history
router.get('/', historyController.getHistory)

// GET /api/history/:versionId
router.get('/:versionId', historyController.getResumeVersion)

// DELETE /api/history/:resumeId
router.delete('/:resumeId', historyController.deleteResume)

export { router as historyRouter }
