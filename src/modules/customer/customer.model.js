import { Schema, Types, model } from "mongoose";
import { Gender, Role } from "../admin/admin.model.js";
import { decrypt, encrypt } from "../../utils/crypto.js";
import { hash } from "../../utils/bcrypt.js";
export const orderStatus = {
  pending: "pending",
  shipped: "shipped",
  delivered: "delivered",
  cancled: "cancled",
};

const customerSchema = new Schema(
  {
    // personal info
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name cannot exceed 20 characters"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name cannot exceed 20 characters"],
    },
    age: Number,
    gender: {
      type: String,
      default: Gender.male,
      enum: Object.values(Gender),
    },
    phone: {
      type: String,
      set: (value) => (value ? encrypt(value) : value),
      get: (value) => (value ? decrypt(value) : value),
    },
    role: {
      type: String,
      default: Role.customer,
      enum: Object.values(Role),
    },
    // auth and OTP
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailOtp: {
      otp: {
        type: String,
        set: (value) => hash(value),
      },
      expiresIn: Date,
    },
    newEmail: {
      type: String,
      unique: true,
    },
    newEmailOtp: {
      otp: {
        type: String,
        set: (value) => hash(value),
      },
      expiresIn: Date,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      set: (value) => hash(value),
    },
    passwordOtp: {
      otp: {
        type: String,
        set: (value) => hash(value),
      },
      expiresIn: Date,
    },
    credentialsChangedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedBy: {
      type: Types.ObjectId,
    },
    wishList: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const customerModel = model("customer", customerSchema);

export default customerModel;
