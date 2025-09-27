import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, TrendingUp, Clock, Target } from 'lucide-react'
import { resumeAPI } from '@/services/api'
import { Resume, OptimizationResult } from '@/types'

export function Dashboard() {
  const [recentResumes, setRecentResumes] = useState<Resume[]>([])
  const [recentOptimizations, setRecentOptimizations] = useState<OptimizationResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // TODO: Implement dashboard data loading
      // const [resumes, optimizations] = await Promise.all([
      //   resumeAPI.getHistory(),
      //   resumeAPI.getRecentOptimizations()
      // ])
      // setRecentResumes(resumes.slice(0, 3))
      // setRecentOptimizations(optimizations.slice(0, 3))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'Total Resumes',
      value: recentResumes.length,
      icon: FileText,
      description: 'Resumes uploaded',
    },
    {
      title: 'Optimizations',
      value: recentOptimizations.length,
      icon: TrendingUp,
      description: 'AI optimizations completed',
    },
    {
      title: 'Avg. Score',
      value: '85%',
      icon: Target,
      description: 'Average optimization score',
    },
    {
      title: 'Last Activity',
      value: '2 hours ago',
      icon: Clock,
      description: 'Most recent optimization',
    },
  ]

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to ResuMatic! Upload your resume and optimize it for any job.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Get started by uploading your resume and analyzing a job description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" asChild>
              <a href="/upload">Upload Resume</a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href="/analyze">Analyze Job Description</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest resume optimizations and uploads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentResumes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity. Upload your first resume to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {recentResumes.map((resume) => (
                  <div key={resume.id} className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {resume.originalFileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
