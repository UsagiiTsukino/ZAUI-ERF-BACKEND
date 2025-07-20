import mongoose from "mongoose";
import { config } from "dotenv";

async function connect() {
  config();
  try {
    await mongoose.connect(process.env.MONG0DB_URI || "");
    console.log("Connect Successfully");
  } catch (error) {
    console.log("Connect Fallure");
  }
}

export { connect };
