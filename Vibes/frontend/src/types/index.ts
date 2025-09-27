export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Resume {
  id: string
  userId: string
  originalFileName: string
  fileUrl: string
  fileType: 'pdf' | 'docx'
  parsedContent: string
  createdAt: Date
  updatedAt: Date
}

export interface ResumeVersion {
  id: string
  resumeId: string
  versionNumber: number
  content: string
  changes: ResumeChange[]
  jobDescriptionId?: string
  createdAt: Date
}

export interface ResumeChange {
  type: 'added' | 'modified' | 'removed'
  section: string
  originalText?: string
  newText?: string
  reason: string
}

export interface JobDescription {
  id: string
  userId: string
  title: string
  company: string
  content: string
  url?: string
  extractedKeywords: string[]
  requiredSkills: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  createdAt: Date
}

export interface OptimizationResult {
  id: string
  resumeId: string
  jobDescriptionId: string
  score: number
  suggestions: OptimizationSuggestion[]
  keywordCoverage: KeywordCoverage[]
  createdAt: Date
}

export interface OptimizationSuggestion {
  type: 'add' | 'modify' | 'remove'
  section: string
  currentText?: string
  suggestedText: string
  reason: string
  priority: 'high' | 'medium' | 'low'
}

export interface KeywordCoverage {
  keyword: string
  found: boolean
  count: number
  locations: string[]
  importance: 'high' | 'medium' | 'low'
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface UploadResponse {
  resumeId: string
  fileName: string
  parsedContent: string
}

export interface AnalyzeResponse {
  jobDescriptionId: string
  title: string
  company: string
  keywords: string[]
  skills: string[]
  experienceLevel: string
}

export interface OptimizeResponse {
  optimizationId: string
  suggestions: OptimizationSuggestion[]
  keywordCoverage: KeywordCoverage[]
  score: number
}
