import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return null
  }
}

export const decodeToken = (token) => {
  return jwt.decode(token)
}
