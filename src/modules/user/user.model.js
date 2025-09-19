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
    age: {
      type: Number,
      min: 18,
      max: 200,
    },
    gender: {
      type: String,
      default: Gender.male,
      enum: Object.values(Gender),
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^\+?[1-9]\d{7,14}$/.test(v.replace(/[\s-]/g, "")),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      set: (value) => (value ? encrypt(value) : value),
      get: (value) => (value ? decrypt(value) : value),
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.customer,
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
      required: true,
    },
    passwordOtp: {
      otp: {
        type: String,
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
    // others (admin)
    // others (customer)
    cart: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
          required: true,
        },
      },
    ],
    orders: [
      {
        orderList: [
          {
            type: Types.ObjectId,
            ref: "sales",
          },
        ],
      },
    ],
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
    // totalSales: {
    //   type: Number,
    //   default: 0,
    // },
    // totalProducts: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// Mongoose lifecycle
userSchema.pre("save", async function (next) {
  // only hash if it's new or modified
  if (this.emailOtp?.otp && this.isModified("emailOtp.otp")) {
    this.emailOtp.otp = await hash(this.emailOtp.otp);
  }
  if (this.newEmailOtp?.otp && this.isModified("newEmailOtp.otp")) {
    this.newEmailOtp.otp = await hash(this.newEmailOtp.otp);
  }
  if (this.password && this.isModified("password")) {
    this.password = await hash(this.password);
  }
  if (this.passwordOtp?.otp && this.isModified("passwordOtp.otp")) {
    this.passwordOtp.otp = await hash(this.passwordOtp.otp);
  }
});

const userModel = model("user", userSchema);

export default userModel;
