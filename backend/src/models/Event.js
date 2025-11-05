import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startTime: {
      type: Date,
      required: [true, 'Please provide a start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Please provide an end time'],
    },
    status: {
      type: String,
      enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
      default: 'BUSY',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Validate end time is after start time
eventSchema.pre('save', function (next) {
  if (this.endTime <= this.startTime) {
    const err = new Error('End time must be after start time')
    return next(err)
  }
  next()
})

export default mongoose.model('Event', eventSchema)
