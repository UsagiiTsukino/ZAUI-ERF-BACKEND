import { Schema } from "mongoose";
import { ProductSchema } from "./Product";
import mongoose from "mongoose";

export const CartItemSchema = new Schema({
  product: ProductSchema,
  quantity: Number,
});

export default mongoose.model("CartItem", CartItemSchema);
