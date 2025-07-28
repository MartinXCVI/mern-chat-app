import mongoose from "mongoose";
import type { ConnectOptions } from "mongoose";
import { DATABASE_URI, NODE_ENV } from "./env.js";

/*
* Mongoose options settings
*/
const mongooseOptions: ConnectOptions = {
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 60000,
  bufferCommands: false
}

/*
* MongoDB connection with error handling and retry logic
*/
const connectDB = async (): Promise<void> => {
  // Validating connection string
  if(!DATABASE_URI) {
    console.error('Database connection string is missing.')
    process.exit(1)
  }

  const maxRetries: number = 5
  let retryCount: number = 0

  const connect = async (): Promise<void> => {
    try {
      await mongoose.connect(DATABASE_URI, mongooseOptions)
      console.log('MongoDB connection attempt successfully executed')

      if(NODE_ENV === 'development') {
        console.log(`Connected to database: ${mongoose.connection.name}`)
      }
    } catch(error: unknown) {
      retryCount++
      console.error(`MongoDB connection failed attempt: ${retryCount}/${maxRetries}:`)

      if(error instanceof Error) {
        console.error(`Internal server error while attempting to execute the database connection: ${error.message || error}`)
      } else {
        console.error(`Internal server error while attempting to execute the database connection: ${error}`)
      }

      if(retryCount < maxRetries) {
        console.log('Retrying connection in 5 seconds...')
        setTimeout(connect, 5000)
      } else {
        console.error(`Failed to connect to MongoDB after ${maxRetries} attempts.`)
        process.exit(1)
      }
    }
  } // End of connect

  // Connection events
  mongoose.connection.on('connected', ()=> {
    console.log('Mongoose connected to MongoDB')
  })

  mongoose.connection.on('error', (error)=> {
    console.error(`Mongoose connection error: ${error}`)
  })

  mongoose.connection.on('disconnected', ()=> {
    console.log('Mongoose disconnected from MongoDB')
  })

  // Shutdown
  process.on('SIGINT', async ()=> {
    await mongoose.connection.close()
    console.log('MongoDB connection closed through app termination')
    process.exit(0)
  })

  await connect()
} // End of connectDB

export default connectDB