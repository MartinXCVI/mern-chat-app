import mongoose from "mongoose";

export interface IMessageSchema {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  text: string;
  image: string;
}