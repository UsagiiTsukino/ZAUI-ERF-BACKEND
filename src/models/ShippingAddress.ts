import { Schema } from "mongoose";
import mongoose from "mongoose";

export const ShippingAddressSchema = new Schema({
  alias: String,
  address: String,
  name: String,
  phone: String,
});

export default mongoose.model("ShippingAddress", ShippingAddressSchema);
