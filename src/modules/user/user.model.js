import { Schema, Types, model } from "mongoose";
import { decrypt, encrypt } from "../../utils/crypto.js";
import { hash } from "../../utils/bcrypt.js";

export const Gender = {
  male: "male",
  female: "female",
};
export const Role = {
  admin: "admin",
  customer: "customer",
  seller: "seller",
};
Object.freeze(Gender);
Object.freeze(Role);

const userSchema = new Schema(
  {
    // personal info
    firstName: {
      type: String,
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name cannot exceed 20 characters"],
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name cannot exceed 20 characters"],
      required: true,
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
      enum: Object.values(Role),
      required: true,
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
      min: 3,
      max: 20,
      set: (value) => hash(value),
      required: true,
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
    // others (customer)
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
    // others (seller)
    totalSales: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const userModel = model("user", userSchema);

export default userModel;
