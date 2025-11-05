import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import SignupPage from '@/pages/auth/signup'
import DashboardPage from '@/pages/app/dashboard'
import SwapPage from '@/pages/app/swap'
import RequestsPage from '@/pages/app/requests'
import { useSocket } from '@/hooks/useSocket'
import { NotificationCenter } from '@/components/NotificationCenter'
import '@/index.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppContent() {
  const { notifications, clearNotifications, clearNotification } = useSocket()

  const handleNotificationNavigate = () => {
    // This will be called when a notification is clicked
    // The navigation happens inside NotificationCenter
  }

  return (
    <>
      {/* Notifications Display */}
      <NotificationCenter
        notifications={notifications}
        onClear={clearNotification}
        onClearAll={clearNotifications}
        onNavigate={handleNotificationNavigate}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/swap"
          element={
            <ProtectedRoute>
              <SwapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
