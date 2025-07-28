import mongoose from "mongoose";
import { ITypingData } from "../interfaces/socketInterfaces.js";


export const validateTypingData = (data: any): data is ITypingData => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.receiverId === 'string' &&
    mongoose.Types.ObjectId.isValid(data.receiverId) &&
    typeof data.isTyping === 'boolean'
  )
}