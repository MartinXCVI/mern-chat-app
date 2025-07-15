import { IUserModel } from "./interfaces/IUserModel.js";
import mongoose, { Schema, Model } from "mongoose";


const UserSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const UserModel: Model<IUserModel> = mongoose.model("User", UserSchema)

export default UserModel