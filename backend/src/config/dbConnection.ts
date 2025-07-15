import mongoose from "mongoose";
import { DATABASE_URI } from "./env.js";


const connectDB = async (): Promise<void> => {
  // Validating connection string
  if(!DATABASE_URI) {
    console.warn('Database connection string is missing.')
    process.exit(1)
  }
  try {
    await mongoose.connect(DATABASE_URI)
    console.log('Database connection attempt successfully executed')
  } catch(error: unknown) {
    if(error instanceof Error) {
      console.error(`Internal server error while attempting to execute the database connection: ${error.message || error}`)
    } else {
      console.error(`Internal server error while attempting to execute the database connection: ${error}`)
    }
  }
}

export default connectDB