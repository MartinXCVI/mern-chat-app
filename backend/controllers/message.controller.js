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
    await Promise.all(conversation.save(), newMessage.save())

    // Sending the message as a response
    res.status(201).json(newMessage)

  } catch(error) {
    console.error("Error in sendMessage controller: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}