import bcrypt from 'bcrypt'
import User from "../models/User.model.js"
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const signup = async (req, res)=> {
  try {
    // Checking user data
    const { fullName, username, password, confirmPass, gender } = req.body

    if(password !== confirmPass) {
      return res.status(400).json({ message: "The passwords do not match" })
    }
    const existingUser = await User.findOne({ username })

    if(existingUser) {
      return res.status(400).json({ message: "The username already exists" })
    }

    // Hashing the password
    const saltRounds = await bcrypt.genSalt(5)
    const hashedPass = await bcrypt.hash(password, saltRounds)

    // Generating a profile pic
    // https://avatar.iran.liara.run/public/boy?username=Scott
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
    // Creatiion of newUser object
    const newUser = new User({
      fullName,
      username,
      password: hashedPass,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic
    })

    // Storing the user in the DB
    if(newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()

      res.status(201).json({ 
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }

  } catch(error) {
    console.error(`Error in sign-up controller: ${error.message}`)
    res.status(500).json({ message: "Internal server error" })
  }
} // End of signup

export const login = async (req, res)=> {
  try {
    // Checking user data
    const { username, password } = req.body
    const user = await User.findOne({ username })
    // Handling password comparison
    const isPassCorrect = await bcrypt.compare(password, user?.password || '')
    // Checking user existence or password correctness
    if(!user || !isPassCorrect) {
      return res.status(401).json({ message: "Invalid username or password" })
    }
    // Generating token and setting cokkie
    generateTokenAndSetCookie(user._id, res)
    // Success status, response and processing user data
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic
    })

  } catch(error) {
    console.error(`Error in login controller: ${error.message}`)
    res.status(500).json({ message: "Internal server error" })
  }
} // End of login

export const logout = (req, res)=> {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json({ message: 'Logged out successfully' })

  } catch(error) {
    console.error(`Error in logout controller: ${error.message}`)
    res.status(500).json({ message: "Internal server error" })
  }
} // End of logout