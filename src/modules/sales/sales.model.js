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
  inProgress: "inProgress",
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
export const shippingAddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

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
      trim: true,
      required: true,
    },
    productImage: [{ url: { type: String, required: true } }],
    originPrice: { type: Number, min: 0, required: true },
    discount: { type: Number, min: 0, max: 100, required: true },
    shippingCost: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
      set: (value) => originPrice - (this.originPrice * this.discount) / 100,
    },
    finalPrice: {
      type: Number,
      min: 0,
      set: (value) => {
        return this.priceAfterDiscount + this.shippingCost;
      },
    },
    // Payment Info
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    saleStatus: {
      type: String,
      enum: Object.values(SaleStatus),
      default: SaleStatus.inProgress,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.pending,
    },
    // Shipping Info
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    trackingNumber: { type: String, required: true },
    // Dates
    // deliveredAt: Date,
    // cancelledAt: Date,
    // completedAt: Date,
    //! How to handle this case if same products has sale just on 1 units and customer will buy 2 units
    //! handle it now buy deal diffrent prices as diffrent sales
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const salesModel = model("sales", salesSchema, "sales"); //3rd parameter to prevent mongoose to pluralize the collection name

export default salesModel;
