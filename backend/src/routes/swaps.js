import express from 'express'
import {
  getSwappableSlots,
  createSwapRequest,
  getSwapRequests,
  respondToSwapRequest,
  cancelSwapRequest,
} from '../controllers/swapController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/available', getSwappableSlots)
router.post('/request', createSwapRequest)
router.get('/requests', getSwapRequests)
router.post('/request/:requestId/respond', respondToSwapRequest)
router.delete('/request/:requestId/cancel', cancelSwapRequest)

export default router
