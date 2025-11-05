import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react'
import { EventCard } from '@/components/shared/event-card'
import { CreateEventDialog } from './create-event-dialog'
import { useSocket } from '@/hooks/useSocket'
import axios from 'axios'

export function DashboardClient() {
  const [events, setEvents] = useState([])
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { refreshTrigger } = useSocket()

  useEffect(() => {
    fetchUserEvents()
  }, [refreshTrigger])

  const fetchUserEvents = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/events')
      setEvents(response.data.events || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError('Failed to load events')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleEventCreated = () => {
    setCreateDialogOpen(false)
    fetchUserEvents()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 sm:h-96">
        <p className="text-muted-foreground">Loading your schedule...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Schedule</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Here are your upcoming slots. You can create new ones or manage existing ones.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Slot
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-900/30 p-3 sm:p-4 text-red-400 text-sm sm:text-base border border-red-800">
            {error}
          </div>
        )}

        {events.length > 0 ? (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} variant="dashboard" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-8 sm:py-12 md:py-16 text-center px-4">
            <CalendarIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground" />
            <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold">No upcoming slots</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              You have not created any slots yet.
            </p>
            <Button className="mt-6 sm:mt-8 w-full sm:w-auto" onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Slot
            </Button>
          </div>
        )}
      </div>
      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={handleEventCreated}
      />
    </>
  )
}
