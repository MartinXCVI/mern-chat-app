import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import UserModel from '../models/User.model.js'
import { JWT_SECRET } from '../config/env.js'


export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Getting access token from request's cookies & validating
    const accessToken = req.cookies.accessToken
    if(!accessToken) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No access token provided"
      })
      return
    }
    // Decoding & validating access token
    const decodedAccessToken = jwt.verify(accessToken, JWT_SECRET) as JwtPayload
    if(!decodedAccessToken.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token payload"
      })
    }
    // Retrieving user from DB (without password)
    const user = await UserModel.findById(decodedAccessToken.userId).select("-password")
    if(!user) {
      res.status(404).json({
        success: false,
        message: "User not found or does not exist"
      })
      return
    }
    // Storing user in the request
    req.user = user
    next()
  } catch(error) {
    console.error(`Error verifying access token: ${error instanceof Error ? error.message : error}`)
    if(error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Access token expired",
        error: error instanceof Error ? error.message : error
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
        error: error instanceof Error ? error.message : error
      })
    }
  }
  return
}