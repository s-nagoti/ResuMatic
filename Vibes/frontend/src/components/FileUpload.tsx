import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onUpload: () => void
  uploadedFile: File | null
  uploading: boolean
  onRemoveFile: () => void
}

export function FileUpload({
  onFileSelect,
  onUpload,
  uploadedFile,
  uploading,
  onRemoveFile,
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
            uploadedFile ? 'border-green-500 bg-green-50' : ''
          )}
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
              <Button variant="outline" size="sm" onClick={onRemoveFile}>
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
              onClick={onUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
