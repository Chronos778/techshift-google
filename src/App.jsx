import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Landing from './pages/Landing'
import ReportIssue from './pages/ReportIssue'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
