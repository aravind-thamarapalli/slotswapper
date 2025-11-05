import Event from '../models/Event.js'
import SwapRequest from '../models/SwapRequest.js'
import { asyncHandler } from '../utils/helpers.js'

export const getSwappableSlots = asyncHandler(async (req, res) => {
  // Get all events that are SWAPPABLE and not owned by current user
  const swappableSlots = await Event.find({
    status: 'SWAPPABLE',
    ownerId: { $ne: req.userId },
  })
    .populate('ownerId', 'name email avatar')
    .sort({ startTime: 1 })

  res.status(200).json({
    success: true,
    count: swappableSlots.length,
    slots: swappableSlots,
  })
})

export const createSwapRequest = asyncHandler(async (req, res) => {
  const { mySlotId, theirSlotId } = req.body

  if (!mySlotId || !theirSlotId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both slot IDs',
    })
  }

  // Verify my slot exists and belongs to the user
  const mySlot = await Event.findById(mySlotId)
  if (!mySlot) {
    return res.status(404).json({
      success: false,
      message: 'Your slot not found',
    })
  }

  if (mySlot.ownerId.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'You do not own this slot',
    })
  }

  if (mySlot.status !== 'SWAPPABLE') {
    return res.status(400).json({
      success: false,
      message: 'Your slot is not available for swapping',
    })
  }

  // Verify their slot exists and is swappable
  const theirSlot = await Event.findById(theirSlotId)
  if (!theirSlot) {
    return res.status(404).json({
      success: false,
      message: 'Requested slot not found',
    })
  }

  if (theirSlot.status !== 'SWAPPABLE') {
    return res.status(400).json({
      success: false,
      message: 'Requested slot is not available for swapping',
    })
  }

  // Update both slots to SWAP_PENDING
  mySlot.status = 'SWAP_PENDING'
  theirSlot.status = 'SWAP_PENDING'
  await mySlot.save()
  await theirSlot.save()

  // Create swap request
  const swapRequest = await SwapRequest.create({
    mySlotId,
    theirSlotId,
    requesterId: req.userId,
    recipientId: theirSlot.ownerId,
  })

  await swapRequest.populate('mySlotId theirSlotId requesterId recipientId')

  // Send real-time notification to recipient
  if (global.socketManager) {
    global.socketManager.notifySwapRequest(
      theirSlot.ownerId.toString(),
      {
        requestId: swapRequest._id,
        requesterName: req.user?.name || 'User',
        recipientName: theirSlot.ownerId.name || 'User',
        mySlot: {
          title: mySlot.title,
          startTime: mySlot.startTime,
          endTime: mySlot.endTime,
        },
        theirSlot: {
          title: theirSlot.title,
          startTime: theirSlot.startTime,
          endTime: theirSlot.endTime,
        },
      }
    )
  }

  res.status(201).json({
    success: true,
    message: 'Swap request created successfully',
    swapRequest,
  })
})

export const getSwapRequests = asyncHandler(async (req, res) => {
  const incoming = await SwapRequest.find({ recipientId: req.userId })
    .populate('mySlotId theirSlotId requesterId recipientId')
    .sort({ createdAt: -1 })

  const outgoing = await SwapRequest.find({ requesterId: req.userId })
    .populate('mySlotId theirSlotId requesterId recipientId')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    incoming,
    outgoing,
  })
})

export const respondToSwapRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params
  const { accept } = req.body

  if (typeof accept !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Please provide accept as true or false',
    })
  }

  const swapRequest = await SwapRequest.findById(requestId)

  if (!swapRequest) {
    return res.status(404).json({
      success: false,
      message: 'Swap request not found',
    })
  }

  if (swapRequest.recipientId.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to respond to this request',
    })
  }

  if (swapRequest.status !== 'PENDING') {
    return res.status(400).json({
      success: false,
      message: 'Swap request has already been responded to',
    })
  }

  if (!accept) {
    // REJECT: Set both slots back to SWAPPABLE
    swapRequest.status = 'REJECTED'
    await swapRequest.save()

    const mySlot = await Event.findById(swapRequest.mySlotId)
    const theirSlot = await Event.findById(swapRequest.theirSlotId)

    mySlot.status = 'SWAPPABLE'
    theirSlot.status = 'SWAPPABLE'
    await mySlot.save()
    await theirSlot.save()

    // Send decline notification to requester
    if (global.socketManager) {
      global.socketManager.notifySwapDeclined(
        swapRequest.requesterId.toString(),
        {
          requestId: swapRequest._id,
          declinedBy: req.user?.name || 'User',
          requesterName: swapRequest.requesterId.name || 'User',
          recipientName: req.user?.name || 'User',
          mySlot: {
            title: mySlot.title,
            startTime: mySlot.startTime,
            endTime: mySlot.endTime,
          },
          theirSlot: {
            title: theirSlot.title,
            startTime: theirSlot.startTime,
            endTime: theirSlot.endTime,
          },
        }
      )
    }

    return res.status(200).json({
      success: true,
      message: 'Swap request rejected',
      swapRequest,
    })
  }

  // ACCEPT: Exchange slot ownership
  const mySlot = await Event.findById(swapRequest.mySlotId)
  const theirSlot = await Event.findById(swapRequest.theirSlotId)

  // Swap ownership
  const tempOwnerId = mySlot.ownerId
  mySlot.ownerId = theirSlot.ownerId
  theirSlot.ownerId = tempOwnerId

  // Set status to BUSY
  mySlot.status = 'BUSY'
  theirSlot.status = 'BUSY'

  await mySlot.save()
  await theirSlot.save()

  swapRequest.status = 'ACCEPTED'
  await swapRequest.save()

  // Send acceptance notification to requester
  if (global.socketManager) {
    global.socketManager.notifySwapAccepted(
      swapRequest.requesterId.toString(),
      {
        requestId: swapRequest._id,
        acceptedBy: req.user?.name || 'User',
        requesterName: swapRequest.requesterId.name || 'User',
        recipientName: req.user?.name || 'User',
        mySlot: {
          title: mySlot.title,
          startTime: mySlot.startTime,
          endTime: mySlot.endTime,
        },
        theirSlot: {
          title: theirSlot.title,
          startTime: theirSlot.startTime,
          endTime: theirSlot.endTime,
        },
      }
    )
  }

  res.status(200).json({
    success: true,
    message: 'Swap request accepted. Slots have been exchanged!',
    swapRequest: await swapRequest.populate(
      'mySlotId theirSlotId requesterId recipientId'
    ),
  })
})

export const cancelSwapRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params

  const swapRequest = await SwapRequest.findById(requestId)

  if (!swapRequest) {
    return res.status(404).json({
      success: false,
      message: 'Swap request not found',
    })
  }

  if (
    swapRequest.requesterId.toString() !== req.userId &&
    swapRequest.recipientId.toString() !== req.userId
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this request',
    })
  }

  if (swapRequest.status !== 'PENDING') {
    return res.status(400).json({
      success: false,
      message: 'Can only cancel pending swap requests',
    })
  }

  swapRequest.status = 'REJECTED'
  await swapRequest.save()

  // Set both slots back to SWAPPABLE
  const mySlot = await Event.findById(swapRequest.mySlotId)
  const theirSlot = await Event.findById(swapRequest.theirSlotId)

  mySlot.status = 'SWAPPABLE'
  theirSlot.status = 'SWAPPABLE'
  await mySlot.save()
  await theirSlot.save()

  // Send cancellation notification
  const recipientId = swapRequest.requesterId.toString() === req.userId
    ? swapRequest.recipientId.toString()
    : swapRequest.requesterId.toString()

  if (global.socketManager) {
    global.socketManager.notifySwapCancelled(recipientId, {
      requestId: swapRequest._id,
      cancelledBy: req.user?.name || 'User',
      requesterName: swapRequest.requesterId.name || 'User',
      recipientName: swapRequest.recipientId.name || 'User',
      mySlot: {
        title: mySlot.title,
        startTime: mySlot.startTime,
        endTime: mySlot.endTime,
      },
      theirSlot: {
        title: theirSlot.title,
        startTime: theirSlot.startTime,
        endTime: theirSlot.endTime,
      },
    })
  }

  res.status(200).json({
    success: true,
    message: 'Swap request cancelled',
  })
})
