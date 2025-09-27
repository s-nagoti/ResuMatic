import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Download, Trash2, Eye } from 'lucide-react'
import { resumeAPI } from '@/services/api'
import { Resume, ResumeVersion } from '@/types'

export function History() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      // TODO: Implement history loading
      // const response = await resumeAPI.getHistory()
      // setResumes(response.resumes)
      // setVersions(response.versions)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      await resumeAPI.deleteResume(resumeId)
      setResumes(resumes.filter(r => r.id !== resumeId))
    } catch (error) {
      console.error('Failed to delete resume:', error)
    }
  }

  const handleDownloadResume = (resume: Resume) => {
    // TODO: Implement download functionality
    console.log('Download resume:', resume.id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume History</h1>
        <p className="mt-2 text-gray-600">
          View and manage your uploaded resumes and their optimization history.
        </p>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No resumes yet</h3>
            <p className="mt-2 text-gray-500">
              Upload your first resume to get started with optimization.
            </p>
            <Button className="mt-4" asChild>
              <a href="/upload">Upload Resume</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{resume.originalFileName}</CardTitle>
                      <CardDescription>
                        Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadResume(resume)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteResume(resume.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">File Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium">{resume.fileType.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <span className="ml-2 font-medium">
                          {/* TODO: Calculate file size */}
                          Unknown
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Version History */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Optimization History</h4>
                    {versions.filter(v => v.resumeId === resume.id).length === 0 ? (
                      <p className="text-sm text-gray-500">No optimizations yet</p>
                    ) : (
                      <div className="space-y-2">
                        {versions
                          .filter(v => v.resumeId === resume.id)
                          .map((version) => (
                            <div
                              key={version.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">
                                    Version {version.versionNumber}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(version.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
