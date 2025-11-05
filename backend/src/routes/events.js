import express from 'express'
import {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  toggleSwappable,
} from '../controllers/eventController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticateToken)

router.post('/', createEvent)
router.get('/', getMyEvents)
router.put('/:eventId', updateEvent)
router.delete('/:eventId', deleteEvent)
router.patch('/:eventId/toggle-swappable', toggleSwappable)

export default router
