import { Router } from 'express'
import { upload, handleUploadError } from '../middleware/upload'
import { uploadResumeController } from '../controllers/uploadResumeController'
import { validateUpload } from '../middleware/validation'

const router = Router()

// POST /api/uploadResume
router.post(
  '/',
  upload.single('resume'),
  handleUploadError,
  validateUpload,
  uploadResumeController.uploadResume
)

export { router as uploadResumeRouter }
