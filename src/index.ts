import express from "express";
import { config } from "dotenv";
import cors from "cors";

config();
const port = process.env.PORT || 3000;

express()
  .use(express.json())
  .use(cors({ origin: ["https://h5.zdn.vn", "http://localhost:3000"] }))
  .get("/", async (req, res) => {
    res.json({
      message: "Đây là backend cho Checkout SDK !",
    });
  })
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
