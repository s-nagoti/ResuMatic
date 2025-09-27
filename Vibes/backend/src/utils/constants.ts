export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const UPLOAD_DIR = 'uploads'

export const AI_MODELS = {
  GEMINI: 'gemini-pro',
  OPENAI: 'gpt-3.5-turbo',
} as const

export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  EXECUTIVE: 'executive',
} as const

export const OPTIMIZATION_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const

export const CHANGE_TYPES = {
  ADD: 'add',
  MODIFY: 'modify',
  REMOVE: 'remove',
} as const
