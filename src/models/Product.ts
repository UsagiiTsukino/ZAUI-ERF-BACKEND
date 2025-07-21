import { Schema } from "mongoose";
import { CategorySchema } from "./Category";
import mongoose from "mongoose";

export const ProductSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: String,
    price: Number,
    originalPrice: Number,
    image: String,
    category: CategorySchema,
    detail: String,
    sizes: [String], // If Size is an object, create SizeSchema
    colors: [String], // If Color is an object, create ColorSchema
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
