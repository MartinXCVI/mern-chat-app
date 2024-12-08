import bcrypt from 'bcrypt'
import User from "../models/User.model.js"
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const signup = async (req, res)=> {
  try {
    const { fullName, username, password, confirmPass, gender } = req.body

    if(password !== confirmPass) {
      return res.status(400).json({ message: "The passwords do not match" })
    }
    const user = await User.findOne({ username })

    if(user) {
      return res.status(400).json({ message: "The username already exists" })
    }

    // Hashing the password
    const saltRounds = await bcrypt.genSalt(5)
    const hashedPass = await bcrypt.hash(password, saltRounds)

    // https://avatar.iran.liara.run/public/boy?username=Scott
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

    const newUser = new User({
      fullName,
      username,
      password: hashedPass,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic
    })

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
}

export const login = (req, res)=> {
  console.log('login')
}

export const logout = (req, res)=> {
  console.log('logout')
}