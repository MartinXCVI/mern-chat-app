import { Request, Response } from "express"
import mongoose from "mongoose"
import UserModel from "../models/User.model.js"
import MessageModel from "../models/Message.model.js"
import cloudinary from "../libs/cloudinary.js"
import { getReceiverSocketId } from "../libs/socket.js"
import { io } from "../libs/socket.js"


/*
* @desc: Get users list to display on the panel's sidebar
* @route: /api/messages/users
* @method: GET
* @access: Private
*/
export const getUsersForSidebar = async (req: Request, res: Response): Promise<void> => {
  // Getting user id from the request
  const loggedInUserId = req.user?._id
  if(!loggedInUserId) {
    res.status(400).json({
      success: false,
      message: "Unauthorized: User not found in the request"
    })
    return
  }
  try {
    // Retrieving the list of users except for the users whose IDs match those in the request
    const filteredUsers = await UserModel
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .lean() // returns plain JS objects - faster & smaller
    // Successful response with just the users list
    res.status(200).json({
      success: true,
      message: "Users list successfully retrieved",
      users: filteredUsers
    })
  } catch(error) {
    console.error(`Error retrieving users list for the client to display: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve the user's list for the client to display",
      error: error instanceof Error ? error.message : error
    })
  }
} // End of getUsersForSidebar controller


/*
* @desc: Get users messages
* @route: /api/messages/:id
* @method: GET
* @access: Private
*/
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  // Getting ids from the requests
  const { id: userToChatId } = req.params
  const myId = req.user._id
  // Validations
  if(!myId) {
    res.status(400).json({
      success: false,
      message: "Unauthorized: User not found in the request",
    })
    return
  }
  if(!userToChatId) {
    res.status(400).json({
      success: false,
      message: "Missing or invalid user ID parameter"
    })
    return
  }
  if(!mongoose.Types.ObjectId.isValid(userToChatId)) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID format"
    })
    return
  }
  // Attempting to retrieve users' messages
  try {
    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    })
    .lean() // returns plain JS objects - faster & smaller
    // Successful response
    res.status(200).json({
      success: true,
      message: "Messages successfully retrieved",
      messages: messages
    })
  } catch(error) {
    console.error(`Error retrieving messages: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to retrieve users' messages",
      error: error instanceof Error ? error.message : error
    })
  }
} // End of getMessages controller



/*
* @desc: Send message
* @route: /api/messages/send/:id
* @method: POST
* @access: Private
*/
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  // Getting data from the request
  const { text, image } = req.body
  const { id: receiverId } = req.params
  const senderId = req.user?._id
  // Message validations
  if(!senderId) {
    res.status(400).json({
      success: false,
      message: "Unauthorized: Sender not found"
    })
    return
  }
  if(!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
    res.status(400).json({
      success: false,
      message: "Invalid receiver ID"
    })
    return
  }
  if(!text?.trim() && !image) {
    res.status(400).json({
      success: false,
      message: "Message must contain text or an image"
    })
    return
  }
  // Image validations
  if(image) {
    const isBase64 = /^data:image\/(png|jpeg|jpg|webp);base64,/.test(image)
    if(!isBase64) {
      res.status(400).json({
        success: false,
        message: "Invalid image format"
      })
      return
    }
    const MAX_BASE64_LENGTH = 7_000_000 // ~5MB binary
    if(image.length > MAX_BASE64_LENGTH) {
      res.status(400).json({
        success: false,
        message: "Image too large. Max 5MB"
      })
      return
    }
  }
  // Attempting to create & send message
  try {
    // Uploading image (if any)
    let imageUrl
    if(image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }
    // Creating & storing new message
    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text: text?.trim() || "",
      image: imageUrl || null
    })
    const savedMessage = await newMessage.save()

    /* Socket implementation */
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    
    // Successful response
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage: savedMessage
    })
  } catch(error) {
    console.error(`Error sending message: ${error instanceof Error ? error.message : error}`)
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting to send message",
      error: error instanceof Error ? error.message : error
    })
  }
  return
} // End of sendMessage controller