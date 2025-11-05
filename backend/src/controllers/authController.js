import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'
import { asyncHandler } from '../utils/helpers.js'

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    })
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  const token = generateToken(user._id)

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    })
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    })
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    })
  }

  const token = generateToken(user._id)

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  })
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  })
})
