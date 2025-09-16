import { Schema, Types, model } from "mongoose";

export const PaymentMethod = {
  paypal: "paypal",
  creditCard: "creditCard",
  cash: "cash",
  bankTransfer: "bankTransfer",
  applePay: "applePay",
  googlePay: "googlePay",
};
export const SaleStatus = {
  pending: "pending",
  completed: "completed",
  cancelled: "cancelled",
  refunded: "refunded",
};
export const PaymentStatus = {
  pending: "pending",
  paid: "paid",
  failed: "failed",
  refunded: "refunded",
};
Object.freeze(PaymentMethod);
Object.freeze(SaleStatus);
Object.freeze(PaymentStatus);

const salesSchema = new Schema(
  {
    // Product & Customer & Seller
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
    customerId: {
      type: Types.ObjectId,
      ref: "customer",
      required: true,
      index: true,
    },
    sellerId: {
      type: Types.ObjectId,
      ref: "seller",
      required: true,
    },
    // Details (snapshot at time of sale)
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productImage: [{ url: { type: String, required: true } }],
    originPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    priceAfterDiscount: {
      type: Number,
      min: 0,
      set: (value) => unitPrice - (this.unitPrice * this.unitDiscount) / 100,
    },
    shippingCost: {
      type: Number,
      min: 0,
      default: 0,
    },
    finalPrice: { type: Number, min: 0 },
    // Payment Info
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    saleStatus: {
      type: String,
      enum: Object.values(SaleStatus),
      default: SaleStatus.pending,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.pending,
    },
    // Shipping Info
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    trackingNumber: String,
    // Dates
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    completedAt: Date,
    //! How to handle this case
    // ammount: Number
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const salesModel = model("sales", salesSchema);

export default salesModel;
