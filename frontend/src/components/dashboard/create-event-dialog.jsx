import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'

export function CreateEventDialog({ isOpen, onOpenChange }) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      // Convert datetime-local to ISO format
      const startDate = new Date(startTime).toISOString()
      const endDate = new Date(endTime).toISOString()

      await axios.post('/api/events', {
        title,
        startTime: startDate,
        endTime: endDate,
      })

      // Reset form
      setTitle('')
      setStartTime('')
      setEndTime('')
      onOpenChange()
    } catch (err) {
      console.error('Failed to create event:', err)
      setError(err.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Create New Slot</DialogTitle>
          <DialogDescription>
            Create a new time slot for your calendar. You can make it swappable later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded bg-red-950 p-3 text-sm text-red-400 border border-red-800">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Team Meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-white placeholder:text-slate-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-white placeholder:text-slate-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="text-white placeholder:text-slate-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Slot'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
