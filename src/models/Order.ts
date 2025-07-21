import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus, PaymentStatus, CartItem, Delivery } from "../types/type";

export interface IOrder extends Document {
  zaloUserId: string;
  checkoutSdkOrderId?: number;
  info: {
    id: number;
    items: CartItem[];
    total: number;
    delivery: Delivery;
    note: string;
    createdAt: Date;
    receivedAt: Date;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
  };
}

const CartItemSchema = new Schema({
  product: { type: Object, required: true },
  quantity: { type: Number, required: true },
});

const DeliverySchema = new Schema({
  type: { type: String, enum: ["shipping", "pickup"], required: true },
  // shipping fields
  alias: String,
  address: String,
  name: String,
  phone: String,
  // pickup fields
  stationId: Number,
});

const OrderInfoSchema = new Schema({
  id: { type: Number, required: true },
  items: [CartItemSchema],
  total: { type: Number, required: true },
  delivery: DeliverySchema,
  note: String,
  createdAt: { type: Date, default: Date.now },
  receivedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "shipping", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    zaloUserId: { type: String, required: true },
    checkoutSdkOrderId: Number,
    info: { type: OrderInfoSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
