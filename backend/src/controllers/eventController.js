import Event from '../models/Event.js'
import { asyncHandler } from '../utils/helpers.js'

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime } = req.body

  if (!title || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    })
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return res.status(400).json({
      success: false,
      message: 'End time must be after start time',
    })
  }

  const event = await Event.create({
    title,
    description,
    startTime,
    endTime,
    ownerId: req.userId,
    status: 'BUSY',
  })

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    event,
  })
})

export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ ownerId: req.userId }).sort({ startTime: 1 })

  res.status(200).json({
    success: true,
    count: events.length,
    events,
  })
})

export const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params
  const { title, description, startTime, endTime, status } = req.body

  const event = await Event.findById(eventId)

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    })
  }

  if (event.ownerId.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this event',
    })
  }

  if (title) event.title = title
  if (description) event.description = description
  if (startTime) event.startTime = startTime
  if (endTime) event.endTime = endTime
  if (status && ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'].includes(status)) {
    event.status = status
  }

  await event.save()

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    event,
  })
})

export const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params

  const event = await Event.findById(eventId)

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    })
  }

  if (event.ownerId.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this event',
    })
  }

  await Event.findByIdAndDelete(eventId)

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  })
})

export const toggleSwappable = asyncHandler(async (req, res) => {
  const { eventId } = req.params

  const event = await Event.findById(eventId)

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    })
  }

  if (event.ownerId.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this event',
    })
  }

  if (event.status === 'BUSY') {
    event.status = 'SWAPPABLE'
  } else if (event.status === 'SWAPPABLE') {
    event.status = 'BUSY'
  } else {
    return res.status(400).json({
      success: false,
      message: 'Cannot toggle status for events in SWAP_PENDING state',
    })
  }

  await event.save()

  res.status(200).json({
    success: true,
    message: 'Event status updated successfully',
    event,
  })
})
