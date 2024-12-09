import User from "../models/User.model.js"

export const getUsersForSidebar = async (req, res)=> {

  try {
    // Getting user id
    const loggedInUserId = req.user._id
    // Getting all users from DB except the currently authenticated one
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

    res.status(200).json(filteredUsers)

  } catch (error) {
    console.error("Error in getUsersForSidebar controller: ", error.message)
    res.status(500),json({ message: "Internal server error" })
  }
}