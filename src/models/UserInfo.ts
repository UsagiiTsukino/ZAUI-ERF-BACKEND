import { Schema } from "mongoose";
import mongoose from "mongoose";

export const UserInfoSchema = new Schema(
  {
    id: { type: String, required: true },
    name: String,
    avatar: String,
    phone: String,
    email: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("UserInfo", UserInfoSchema);
