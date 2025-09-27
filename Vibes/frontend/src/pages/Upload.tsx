import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { resumeAPI } from '@/services/api'
import toast from 'react-hot-toast'

export function Upload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleUpload = async () => {
    if (!uploadedFile) return

    try {
      setUploading(true)
      const response = await resumeAPI.uploadResume(uploadedFile)
      toast.success('Resume uploaded successfully!')
      console.log('Upload response:', response)
      // TODO: Navigate to analyze page or show success message
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Resume</h1>
        <p className="mt-2 text-gray-600">
          Upload your resume in PDF or DOCX format to get started with optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>
              Drag and drop your resume file here, or click to select a file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
                ${uploadedFile ? 'border-green-500 bg-green-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={removeFile}>
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isDragActive
                        ? 'Drop the file here'
                        : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF or DOCX files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-6">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
            <CardDescription>
              Follow these guidelines for the best results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Supported Formats</p>
                  <p className="text-xs text-muted-foreground">
                    PDF and DOCX files are supported
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">File Size</p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size is 10MB
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Quality Tips</p>
                  <p className="text-xs text-muted-foreground">
                    Use clear, well-formatted resumes for better parsing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
