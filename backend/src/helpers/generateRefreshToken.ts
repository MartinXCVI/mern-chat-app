// generateRefreshToken.ts

import { Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_REFRESH_SECRET, NODE_ENV } from "../config/env.js"
import { Types } from "mongoose"

export const generateRefreshToken = (userId: Types.ObjectId, res: Response): string => {
  const refreshToken = jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 7 days
  )

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // miliseconds - 7 days
  })

  return refreshToken
}
