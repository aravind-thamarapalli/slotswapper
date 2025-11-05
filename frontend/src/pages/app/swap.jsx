import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/shared/app-layout'
import { EventCard } from '@/components/shared/event-card'
import { useSocket } from '@/hooks/useSocket'
import axios from 'axios'

export default function SwapPage() {
  const navigate = useNavigate()
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { refreshTrigger } = useSocket()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchAvailableSlots()
  }, [navigate, refreshTrigger])

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/swaps/available')
      setAvailableSlots(response.data.slots || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch available slots:', err)
      setError('Failed to load available slots')
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleSlotAction = () => {
    // Refresh is now automatic via socket hook
    // This function is kept for EventCard compatibility
  }

  return (
    <AppLayout>
      <div className="container px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Available Slots for Swapping</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Browse available slots from other users and request a swap
            </p>
          </div>

          {loading && (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <p className="text-muted-foreground">Loading available slots...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-900/30 p-3 sm:p-4 text-red-400 text-sm sm:text-base border border-red-800">
              {error}
            </div>
          )}

          {!loading && availableSlots.length > 0 ? (
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {availableSlots.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="marketplace"
                  onAction={handleSlotAction}
                />
              ))}
            </div>
          ) : !loading && (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <p className="text-muted-foreground text-sm sm:text-base">No available slots for swapping</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
