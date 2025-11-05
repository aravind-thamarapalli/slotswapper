import mongoose from 'mongoose'
import { config } from './config.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
