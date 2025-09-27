import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KeywordCoverage } from '@/types'

interface KeywordChartProps {
  data: KeywordCoverage[]
  title?: string
  description?: string
}

export function KeywordChart({ data, title = "Keyword Coverage", description }: KeywordChartProps) {
  const chartData = data.map(item => ({
    keyword: item.keyword,
    count: item.count,
    found: item.found ? 1 : 0,
    importance: item.importance
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="keyword" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'found' ? 'Found' : 'Count'
                ]}
                labelFormatter={(label) => `Keyword: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#8884d8" 
                name="Mentions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
