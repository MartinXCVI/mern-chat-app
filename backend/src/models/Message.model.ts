import mongoose, { Schema, Model } from 'mongoose'
import { IMessageSchema } from './interfaces/IMessageModel.js'


const MessageSchema = new Schema<IMessageSchema>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true
  }
)

const MessageModel: Model<IMessageSchema> = mongoose.model('Message', MessageSchema)

export default MessageModel