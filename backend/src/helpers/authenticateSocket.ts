import { IUserSocket } from '../interfaces/socketInterfaces.js';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/env.js";
import { IJWTPayload } from '../interfaces/IJWTPayload.js';
import mongoose from 'mongoose';


export const authenticateSocket = async (socket: IUserSocket): Promise<IJWTPayload | null> => {
  try {
    // Try to get token from cookies first (sent automatically with socket handshake)
    const cookies = socket.handshake.headers.cookie
    let token = null
    
    if(cookies) {
      const tokenMatch = cookies.match(/accessToken=([^;]+)/)
      token = tokenMatch ? tokenMatch[1] : null
    }
    
    if(!token || typeof token !== 'string') {
      return null
    }

    // Removing "Bearer " prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '')
    
    // Verifying JWT token
    const decoded = jwt.verify(cleanToken, JWT_SECRET) as IJWTPayload
    
    // Validating required fields
    if(!decoded.userId || !decoded.email || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return null
    }

    // Checking token expiration (additional validation)
    const now = Math.floor(Date.now() / 1000)
    if(decoded.exp <= now) {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Socket authentication error:', error instanceof Error ? error.message : error)
    return null
  }
}