import { Schema } from "mongoose";
import mongoose from "mongoose";

export const DeliverySchema = new Schema(
  {
    type: { type: String, enum: ["shipping", "pickup"], required: true },
    // Shipping fields
    alias: String,
    address: String,
    name: String,
    phone: String,
    // Pickup fields
    stationId: Number,
  },
  { _id: false, timestamps: true }
);

export default mongoose.model("Delivery", DeliverySchema);
