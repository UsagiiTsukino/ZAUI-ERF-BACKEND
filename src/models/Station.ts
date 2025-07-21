import { Schema } from "mongoose";
import { LocationSchema } from "./Location";
import mongoose from "mongoose";

export const StationSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: String,
    image: String,
    address: String,
    location: LocationSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Station", StationSchema);
