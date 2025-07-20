import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { CreateOrderRequest, Order as OrderInfo } from "./types/type";
import { connect } from "./config/db/mongodb";
import enforce from "express-sslify";
import https from "https";
import fs from "fs";
import Order from "./models/Order";
import Product from "./models/Product";
import Category from "./models/Category";
import Station from "./models/Station";
import { createHmac } from "crypto";
import axios from "axios";
import { Request, Response } from "express";

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};
interface OrderDoc {
  id: number;
  zaloUserId: string;
  checkoutSdkOrderId?: number;
  info: OrderInfo;
}
interface Schema {
  orders: OrderDoc[];
}

config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors({ origin: ["https://h5.zdn.vn", "http://localhost:3000"] }));
app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.get("/", async (req, res) => {
  res.json({
    message: "Đây là backend cho Checkout SDK !",
  });
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
  }
});
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục" });
  }
});
app.get("/stations", async (req, res) => {
  try {
    const stations = await Station.find({});
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách trạm" });
  }
});
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({
      "info.id": -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
  }
});
// Lấy chi tiết đơn hàng theo id
app.get("/orders/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne(
      { "info.id": req.params.id },
      { info: 1, _id: 0 }
    );
    if (!order) {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    } else {
      res.json(order.info);
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng" });
  }
});
app.post("/orders", async (req, res) => {
  try {
    const { zaloUserId, items, total } = req.body as CreateOrderRequest;
    // Lấy id lớn nhất hiện có
    const lastOrder = await Order.findOne({}, {}, { sort: { "info.id": -1 } });
    const id = lastOrder ? lastOrder.info.id + 1 : 1;
    const order = new Order({
      zaloUserId,
      info: {
        id,
        items,
        total,
        delivery: {
          type: "pickup",
          stationId: 1,
        },
        note: "",
        createdAt: new Date(),
        receivedAt: new Date(),
        status: "pending",
        paymentStatus: "pending",
      },
    });
    await order.save();
    res.status(201).json({
      message: "Đã tạo đơn hàng thành công!",
      orderId: order.info.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng" });
  }
});
// Cập nhật toàn bộ đơn hàng (PUT)
app.put("/orders/:id", async (req: Request, res: Response) => {
  try {
    const update = req.body;
    const order = await Order.findOneAndUpdate(
      { "info.id": req.params.id },
      { $set: { info: update } },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    } else {
      res.json({
        message: "Đã cập nhật đơn hàng thành công!",
        order: order.info,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng" });
  }
});
// Cập nhật một phần đơn hàng (PATCH)
app.patch("/orders/:id", async (req: Request, res: Response) => {
  try {
    const update = req.body;
    const order = await Order.findOneAndUpdate(
      { "info.id": req.params.id },
      {
        $set: Object.keys(update).reduce((acc, key) => {
          acc[`info.${key}`] = update[key];
          return acc;
        }, {}),
      },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    } else {
      res.json({
        message: "Đã cập nhật đơn hàng thành công!",
        order: order.info,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng" });
  }
});
// Xóa đơn hàng
app.delete("/orders/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findOneAndDelete({ "info.id": req.params.id });
    if (!order) {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    } else {
      res.json({ message: "Đã xóa đơn hàng thành công!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa đơn hàng" });
  }
});
app.post("/mac", async (req, res) => {
  const { amount, desc, item, extradata, method } = req.body;
  const params = { amount, desc, item, extradata, method };
  const dataMac = Object.keys(params)
    .sort()
    .map(
      (key) =>
        `${key}=${
          typeof params[key] === "object"
            ? JSON.stringify(params[key])
            : params[key]
        }`
    )
    .join("&");
  const mac = createHmac("sha256", process.env.CHECKOUT_SDK_PRIVATE_KEY!)
    .update(dataMac)
    .digest("hex");
  res.json({ mac });
});
app.post("/link", async (req, res) => {
  const { orderId, checkoutSdkOrderId, miniAppId } = req.body;
  const order = await Order.findOne({ "info.id": orderId });
  if (!order) {
    res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  } else {
    order.checkoutSdkOrderId = checkoutSdkOrderId;
    await order.save();
    setTimeout(async () => {
      if (order.info.paymentStatus === "pending") {
        const dataMac = `appId=${miniAppId}&orderId=${checkoutSdkOrderId}&privateKey=${process.env.CHECKOUT_SDK_PRIVATE_KEY}`;
        const mac = createHmac("sha256", process.env.CHECKOUT_SDK_PRIVATE_KEY!)
          .update(dataMac)
          .digest("hex");
        const {
          data: { data },
        } = await axios<{ data: { returnCode: 0 | 1 | -1 } }>(
          "https://payment-mini.zalo.me/api/transaction/get-status",
          {
            params: {
              orderId: checkoutSdkOrderId,
              appId: miniAppId,
              mac,
            },
          }
        );
        if (data.returnCode) {
          order.info.paymentStatus =
            data.returnCode === 1 ? "success" : "failed";
          await order.save();
        }
      }
    }, 20 * 60 * 1000);
    res.json({ message: "Đã liên kết đơn hàng thành công!" });
  }
});
app.post("/callback", async (req, res) => {
  try {
    const { data, overallMac } = req.body;
    const { orderId, resultCode, extradata } = data;
    // Tạo MAC
    const dataOverallMac = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join("&");
    const validOverallMac = createHmac(
      "sha256",
      process.env.CHECKOUT_SDK_PRIVATE_KEY!
    )
      .update(dataOverallMac)
      .digest("hex");
    if (overallMac === validOverallMac) {
      // Lưu ý 1. Cách lấy `myOrderId`
      const { myOrderId } = JSON.parse(decodeURIComponent(extradata));
      const order = await Order.findOne({ "info.id": myOrderId });
      if (order) {
        order.info.paymentStatus = resultCode === 1 ? "success" : "failed";
        await order.save();
        // Lưu ý 2. Cách trả về kết quả
        res.json({
          returnCode: 1,
          returnMessage: "Đã cập nhật trạng thái đơn hàng thành công!",
        });
      } else {
        throw Error("Không tìm thấy đơn hàng");
      }
    } else {
      throw Error("MAC không hợp lệ");
    }
  } catch (error) {
    res.json({
      returnCode: 0,
      returnMessage: String(error),
    });
  }
});
https.createServer(options, app).listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
connect();
