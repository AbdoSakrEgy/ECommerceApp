import { Schema, Types, model } from "mongoose";

const Category = {
  electronics: "electronics",
  fashion: "fashion",
  home: "home",
  beauty: "beauty",
  sports: "sports",
  books: "books",
  other: "other",
};
const ProductStatus = {
  active: "active",
  outOfStock: "outOfStock",
  disCounted: "disCounted",
};
Object.freeze(Category);
Object.freeze(ProductStatus);

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
      required: true,
    },
    seller: {
      type: Types.ObjectId,
      ref: "seller",
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(Category),
      required: true,
    },
    subCategory: {
      type: String,
      trim: true,
      minlength: [3, "Product subCategory must be at least 3 characters"],
      maxlength: [100, "Product subCategory cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    images: [{ url: { type: String, required: true } }],
    ratings: [
      {
        customerId: { type: Types.ObjectId, ref: "customer" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    originPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    priceAfterDiscount: {
      type: Number,
      min: 0,
      set: (value) => originPrice - (this.originPrice * this.discount) / 100,
    },
    stock: { type: Number, default: 0, min: 0 },
    productStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "seller" || "admin",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "seller" || "admin",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const productModel = model("product", productSchema);

export default productModel;
