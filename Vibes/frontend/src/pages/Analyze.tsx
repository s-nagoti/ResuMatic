import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Search, Link, FileText, Sparkles } from 'lucide-react'
import { resumeAPI } from '@/services/api'
import toast from 'react-hot-toast'

export function Analyze() {
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleUrlAnalysis = async () => {
    if (!jobUrl.trim()) {
      toast.error('Please enter a job URL')
      return
    }

    try {
      setAnalyzing(true)
      const response = await resumeAPI.analyzeJob({ url: jobUrl })
      setAnalysisResult(response)
      toast.success('Job description analyzed successfully!')
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Failed to analyze job description. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleTextAnalysis = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description')
      return
    }

    try {
      setAnalyzing(true)
      const response = await resumeAPI.analyzeJob(jobDescription)
      setAnalysisResult(response)
      toast.success('Job description analyzed successfully!')
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Failed to analyze job description. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analyze Job Description</h1>
        <p className="mt-2 text-gray-600">
          Paste a job description or URL to extract keywords and requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Methods */}
        <div className="space-y-6">
          {/* URL Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link className="h-5 w-5" />
                <span>Job URL</span>
              </CardTitle>
              <CardDescription>
                Enter a job posting URL to automatically extract the description.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="job-url">Job Posting URL</Label>
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://example.com/job-posting"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>
              <Button
                onClick={handleUrlAnalysis}
                disabled={analyzing || !jobUrl.trim()}
                className="w-full"
              >
                {analyzing ? 'Analyzing...' : 'Analyze URL'}
              </Button>
            </CardContent>
          </Card>

          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Job Description Text</span>
              </CardTitle>
              <CardDescription>
                Paste the job description directly into the text area.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                />
              </div>
              <Button
                onClick={handleTextAnalysis}
                disabled={analyzing || !jobDescription.trim()}
                className="w-full"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Text'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                Extracted keywords, skills, and requirements from the job description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Job Title</h4>
                    <p className="text-sm text-gray-600">{analysisResult.title}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Company</h4>
                    <p className="text-sm text-gray-600">{analysisResult.company}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords?.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.skills?.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Experience Level</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {analysisResult.experienceLevel}
                    </span>
                  </div>

                  <Button className="w-full" asChild>
                    <a href="/optimize">Optimize Resume</a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Analyze a job description to see results here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
