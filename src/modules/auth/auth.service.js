import { nanoid } from "nanoid";
import { create, findOne } from "../../DB/db.services.js";
import { createOtp } from "../../utils/createOtp.js";
import { template } from "../../utils/sendEmail/generateHTML.js";
import { sendEmail } from "../../utils/sendEmail/sendEmail.js";
import { successHandler } from "../../utils/successHandler.js";
import adminModel from "../admin/admin.model.js";
import customerModel from "../customer/customer.model.js";
import sellerModel from "../seller/seller.model.js";
import jwt from "jsonwebtoken";

// register
export const register = async (req, res, next) => {
  const { firstName, lastName, age, gender, phone, role, email, password } =
    req.body;
  const Role = {
    admin: "admin",
    customer: "customer",
    seller: "seller",
  };
  let model;
  if (role == Role.admin) {
    model = adminModel;
  } else if (role == Role.customer) {
    model = customerModel;
  } else if (role == Role.seller) {
    model = sellerModel;
  }
  // check: email not exist
  const isUserExist = await findOne(model, { email });
  if (isUserExist) {
    return successHandler({ res, message: "User already exist", status: 400 });
  }
  // step: send otp to email
  const otpCode = createOtp();
  const { isEmailSended, info } = await sendEmail({
    to: email,
    subject: "ECommerceApp",
    html: template(otpCode, firstName, "Confirm email"),
  });
  if (!isEmailSended) {
    return successHandler({
      res,
      message: "Error while checking email",
      status: 400,
    });
  }
  // step: create account
  const user = await create(model, {
    firstName,
    lastName,
    age,
    gender,
    phone,
    role,
    email,
    password,
    emailOtp: {
      otp: otpCode,
      expiresIn: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  // step: create tokens
  const payload = {
    id: user._id,
    email: user.email,
  };
  const jwtid = nanoid();
  const accessToken = jwt.sign(payload, process.env.ACCESS_SEGNATURE, {
    expiresIn: "1h",
    jwtid,
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SEGNATURE, {
    expiresIn: "7d",
    jwtid,
  });
  return successHandler({
    res,
    message: "User created successfully",
    result: { accessToken, refreshToken },
  });
};
// login
export const login = async (req, res, next) => {};
// refreshToken
export const refreshToken = async (req, res, next) => {};
