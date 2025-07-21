import { Schema } from "mongoose";
import mongoose from "mongoose";

export const LocationSchema = new Schema(
  {
    lat: Number,
    lng: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Location", LocationSchema);
