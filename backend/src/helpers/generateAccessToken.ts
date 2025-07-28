import { Response } from "express"
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from "../config/env.js"
import { Types } from "mongoose"


export const generateAccessToken = (userId: Types.ObjectId, userEmail: string, res: Response): string => {
  const token = jwt.sign(
    { userId, email: userEmail },
    JWT_SECRET,
    { expiresIn: "15m"}
  )

  res.cookie("accessToken", token, {
    maxAge: 15 * 60 * 1000, // Miliseconds - 15 minutes
    httpOnly: true, // Prevents XSS
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax', // Prevents CSRF
    secure: NODE_ENV !== "development"
  })
  // Returning token for frontend
  return token
}
