/* MODELS IMPORTS */
import UserModel from "../models/User.model.js"
/* EXPRESS IMPORTS */
import { Request, Response } from "express"
/* MODULES */
import bcrypt from 'bcrypt'
/* ENVIRONMENT VARIABLES */
import { SALT_ROUNDS, NODE_ENV } from "../config/env.js"
/* Helprs/Utilities */
import { generateAccessToken } from "../helpers/generateAccessToken.js"
import { generateRefreshToken } from "../helpers/generateRefreshToken.js"
import cloudinary from "../libs/cloudinary.js"
import { UploadApiResponse } from "cloudinary"


/**
* @description - Register a new user
* @route - /api/auth/signup
* @method - POST
* @access - Public
*/
export const signUp = async (req: Request, res: Response): Promise<void> => {
  // Getting data from request's body
  const { fullName, email, password } = req.body
  // Validating input data
  if(!fullName || !email || !password) {
    res.status(400).json({
      success: false,
      message: "All fields are required"
    })
    return
  }
  // Attempting to create user
  try {
    // Validating user's existence
    const existingUser = await UserModel.findOne({ email })
    if(existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already registered"
      })
      return
    }
    // Hashing password w/ bcrypt
    const salt: string = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword: string = await bcrypt.hash(password, salt)
    // Creating the user
    const newUser = new UserModel({ fullName, email, password: hashedPassword })
    const createdUser = await newUser.save()
    // Generating JWT
    if(createdUser) {
      generateAccessToken(createdUser._id, res)
      generateRefreshToken(createdUser._id, res)
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data."
      })
      return
    }
    // Fresh pull with desired fields
    const freshUser = await UserModel.findById(createdUser._id).select("_id fullName email profilePic")
    // Successful response
    res.status(201).json({
      success: true,
      message: `New user '${createdUser.fullName}' successfully created`,
      user: freshUser
    })
  } catch(error) {
    console.error(`Error on user sign-up: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to sign up user.",
      error: error instanceof Error ? error.message : error
    })
  }
  return
} // End of signUp controller


/*
* @desc: Log in an existing user
* @route: /api/auth/login
* @method: POST
* @access: Public
*/
export const login = async (req: Request, res: Response): Promise<void> => {
  // Getting data from the request's body
  const { email, password } = req.body
  // Attempting to log in user
  try {
    // Validations
    const user = await UserModel.findOne({ email })
    if(!user) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials."
      })
      return
    }
    const passwordMatches = await bcrypt.compare(password, user.password)
    if(!passwordMatches) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials."
      })
      return
    }
    // Generating access and refresh tokens
    generateAccessToken(user._id, res)
    generateRefreshToken(user._id, res)
    // Fresh user from DB, only desired fields
    const freshUser = await UserModel.findById(user._id).select("_id fullName email profilePic")
    // Successful response
    res.status(200).json({
      success: true,
      message: `User successfully logged in`,
      user: freshUser
    })
  } catch(error) {
    console.error(`Error on user login: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to log user in",
      error: error instanceof Error ? error.message : error
    })
  }
  return
} // End of login controller


/*
* @desc: Log out a logged in user
* @route: /api/auth/logout
* @method: POST
* @access: Private
*/
export const logout = (req: Request, res: Response) => {
  // Attempting to logout
  try {
    // Checking if the user's already logged out
    if(!req.cookies?.accessToken && !req.cookies?.refreshToken) {
      res.status(400).json({
        success: false,
        message: "No session found to log out"
      })
      return
    }
    // Clearing the cookies
    const cookieOptions: object = {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      path: '/'
    }
    res.clearCookie('accessToken', cookieOptions)
    res.clearCookie('refreshToken', cookieOptions)
    // Successful logout
    res.status(200).json({
      success: true,
      message: "User successfully logged out. All cookies were cleared!"
    })
  } catch(error) {
    console.error(`Error on user logout: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to log user out",
      error: error instanceof Error ? error.message : error
    })
  }
  return
} // End of logout controller


/*
* @desc: Updates user's profile pic
* @route: /api/auth/update-profile
* @method: PUT
* @access: Private
*/
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id
    if(!profilePic) {
      res.status(400).json({
        success: false,
        message: "Profile pic is required"
      })
      return
    }
    if(typeof profilePic !== "string" || !profilePic.trim()) {
      res.status(400).json({
        success: false,
        message: "Invalid profile pic input"
      })
      return
    }
    let uploadResponse: UploadApiResponse | undefined = undefined
    try {
      uploadResponse = await cloudinary.uploader.upload(profilePic)

      if(!uploadResponse?.secure_url) {
        res.status(500).json({
          success: false,
          message: "Cloudinary did not return a valid URL",
        })
        return
      }
    } catch(uploadError) {
      console.error(`Cloudinary upload error: ${uploadError instanceof Error ? uploadError.message : uploadError}`)
      res.status(500).json({
        success: false,
        message: "Failed to upload picture to Cloudinary",
        error: uploadError instanceof Error ? uploadError.message : uploadError
      })
      return
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    )
    // Successful response
    res.status(200).json({
      success: true,
      message: "User's profile picture successfully updated",
      updatedUser: updatedUser
    })
  } catch(error) {
    console.error(`Error on profile picture update: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to upload profile picture",
      error: error instanceof Error ? error.message : error
    })
  }
  return
} // End of updateProfile controller


/*
* @desc: Check if user is authenticated
* @route: /api/auth/check
* @method: GET
* @access: Private
*/
export const isAuthenticated = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: req.user
    })
  } catch(error) {
    console.error(`Error checking authentication: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to check user's authentication state"
    })
  }
} // End of isAuthenticated controller