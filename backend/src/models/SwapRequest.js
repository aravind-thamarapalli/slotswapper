import mongoose from 'mongoose'

const swapRequestSchema = new mongoose.Schema(
  {
    mySlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Please provide your slot ID'],
    },
    theirSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Please provide their slot ID'],
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
)

// Ensure requester and recipient are different
swapRequestSchema.pre('save', function (next) {
  if (this.requesterId.toString() === this.recipientId.toString()) {
    const err = new Error('Cannot swap with yourself')
    return next(err)
  }
  next()
})

export default mongoose.model('SwapRequest', swapRequestSchema)
