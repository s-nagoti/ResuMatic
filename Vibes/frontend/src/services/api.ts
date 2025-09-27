import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const resumeAPI = {
  // Upload resume file
  uploadResume: async (file: File) => {
    const formData = new FormData()
    formData.append('resume', file)
    
    const response = await api.post('/uploadResume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Analyze job description
  analyzeJob: async (jobDescription: string | { url: string }) => {
    const response = await api.post('/analyzeJob', jobDescription)
    return response.data
  },

  // Optimize resume based on job description
  optimizeResume: async (resumeId: string, jobDescriptionId: string) => {
    const response = await api.post('/optimizeResume', {
      resumeId,
      jobDescriptionId,
    })
    return response.data
  },

  // Get resume history
  getHistory: async () => {
    const response = await api.get('/history')
    return response.data
  },

  // Get specific resume version
  getResumeVersion: async (versionId: string) => {
    const response = await api.get(`/history/${versionId}`)
    return response.data
  },

  // Delete resume
  deleteResume: async (resumeId: string) => {
    const response = await api.delete(`/resumes/${resumeId}`)
    return response.data
  },
}

export default api
