import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Dashboard } from './pages/Dashboard'
import { Upload } from './pages/Upload'
import { Analyze } from './pages/Analyze'
import { History } from './pages/History'
import { Layout } from './components/Layout'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
