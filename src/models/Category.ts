import { Schema } from "mongoose";
import mongoose from "mongoose";

export const CategorySchema = new Schema(
  {
    id: { type: Number, required: true },
    name: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
