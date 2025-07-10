import mongoose from "mongoose";
async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ZaloERF_DB");
    console.log("Connect Successfully");
  } catch (error) {
    console.log("Connect Fallure");
  }
}

export { connect };
