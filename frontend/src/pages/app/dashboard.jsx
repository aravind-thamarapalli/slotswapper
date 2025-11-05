import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/shared/app-layout'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default function DashboardPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <AppLayout>
      <div className="container px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <DashboardClient />
      </div>
    </AppLayout>
  )
}
