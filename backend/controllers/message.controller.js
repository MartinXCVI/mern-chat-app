import Conversation from '../models/Conversation.model.js'
import Message from '../models/Message.model.js'

export const sendMessage = async (req, res)=> {
  try {
    // Getting message (as input)
    const { message } = req.body
    /* Getting receiver id */
    const { id: receiverId } = req.params
    const senderId = req.user._id
    // Checking for the conversation's existence
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
    // Creating the conversation if it doesn't exist
    if(!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      })
    }
    // Creation of new message object
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message,
    })
    // Pushing the message to the messages array
    if(newMessage) {
      conversation.messages.push(newMessage._id)
    }

    // Storing, in parallel, conversations and messages in DB
    await Promise.all([conversation.save(), newMessage.save()])

    // Sending the message as a response
    res.status(201).json(newMessage)

  } catch(error) {
    console.error("Error in sendMessage controller: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getMessages = async (req, res)=> {

  try {
    // Getting users ids
    const { id: userToChatId } = req.params
    const senderId = req.user._id
    // Getting the conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages") // For not getting the ref but the actual messages
    // Handling conversations' nonexistence
    if(!conversation) return res.status(200).json([])
    // Getting and returning the messages
    const messages = conversation.messages
    res.status(200).json(messages)

  } catch(error) {
    console.error("Error in sendMessage controller: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}