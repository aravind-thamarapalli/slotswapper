import { useState } from 'react'
import { formatDateTime, formatDate } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Clock, Edit2, Zap } from 'lucide-react'
import { SlotSelectorDialog } from '@/components/swap/slot-selector-dialog'
import axios from 'axios'

export function EventCard({ event, variant = 'default', onAction }) {
  const [loading, setLoading] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(event)
  const [showSlotSelector, setShowSlotSelector] = useState(false)
  const [userSlots, setUserSlots] = useState([])

  const getStatusIcon = () => {
    switch (currentEvent.status) {
      case 'BOOKED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case 'SWAP_PENDING':
        return <Clock className="h-4 w-4 text-amber-400" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (currentEvent.status) {
      case 'BUSY':
        return 'bg-slate-700 text-slate-100'
      case 'BOOKED':
        return 'bg-emerald-900 text-emerald-100'
      case 'SWAP_PENDING':
        return 'bg-amber-900 text-amber-100'
      case 'SWAPPABLE':
        return 'bg-teal-900 text-teal-100'
      default:
        return 'bg-slate-700 text-slate-100'
    }
  }

  const handleToggleSwappable = async () => {
    try {
      setLoading(true)
      const response = await axios.patch(`/api/events/${currentEvent._id}/toggle-swappable`)
      setCurrentEvent(response.data.event)
      onAction?.()
    } catch (err) {
      console.error('Failed to toggle swappable:', err)
      alert(err.response?.data?.message || 'Failed to update slot status')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSwap = async () => {
    try {
      setLoading(true)
      
      // Get user's available slots first
      const slotsRes = await axios.get('/api/events')
      const slots = slotsRes.data.events || []
      
      if (slots.length === 0) {
        alert('You need to create a slot before requesting a swap')
        setLoading(false)
        return
      }

      // If only 1 slot, use it directly
      if (slots.length === 1) {
        await sendSwapRequest(slots[0]._id)
        return
      }

      // If multiple slots, show selector dialog
      setUserSlots(slots)
      setShowSlotSelector(true)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch slots:', err)
      alert('Failed to load your slots')
      setLoading(false)
    }
  }

  const sendSwapRequest = async (mySlotId) => {
    try {
      setLoading(true)
      await axios.post('/api/swaps/request', {
        mySlotId: mySlotId,
        theirSlotId: event._id,
      })

      alert('Swap request sent!')
      setShowSlotSelector(false)
      onAction?.()
    } catch (err) {
      console.error('Failed to request swap:', err)
      alert(err.response?.data?.message || 'Failed to request swap')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">{event.title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {formatDate(new Date(event.startTime))}
              {event.ownerId?.name && variant === 'marketplace' && (
                <span className="ml-2 text-teal-400">by {event.ownerId.name}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-0 sm:pt-2">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
          <div className="flex-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-400 flex-shrink-0" />
            <span className="font-medium text-slate-200">{formatDateTime(new Date(event.startTime))}</span>
          </div>
          <span className="text-slate-500">→</span>
          <div className="flex-1 flex items-center gap-2">
            <span className="font-medium text-slate-200">{formatDateTime(new Date(event.endTime))}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor()}>{currentEvent.status}</Badge>
        </div>
        {variant === 'dashboard' && (
          <div className="flex gap-2 pt-3 sm:pt-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={handleToggleSwappable}
              disabled={loading || currentEvent.status === 'SWAP_PENDING'}
            >
              <Zap className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
              <span className="text-xs sm:text-sm">
                {currentEvent.status === 'BUSY' ? 'Make Swappable' : 'Mark Busy'}
              </span>
            </Button>
          </div>
        )}
        {variant === 'marketplace' && (
          <Button 
            className="w-full" 
            size="sm" 
            onClick={handleRequestSwap}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Request Swap'}
          </Button>
        )}
      </CardContent>

      <SlotSelectorDialog
        isOpen={showSlotSelector}
        onOpenChange={setShowSlotSelector}
        userSlots={userSlots}
        theirSlot={event}
        onConfirm={sendSwapRequest}
        loading={loading}
      />
    </Card>
  )
}
