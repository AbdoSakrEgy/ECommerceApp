import { nanoid } from "nanoid";
import { create, findOne, findOneAndUpdate } from "../../DB/db.services.js";
import { createOtp } from "../../utils/createOtp.js";
import { template } from "../../utils/sendEmail/generateHTML.js";
import { sendEmail } from "../../utils/sendEmail/sendEmail.js";
import { successHandler } from "../../utils/successHandler.js";
import userModel from "../user/user.model.js";
import jwt from "jsonwebtoken";
import { decodeToken, tokenTypes } from "../../utils/decodeToken.js";
import { compare } from "../../utils/bcrypt.js";

// register
export const register = async (req, res, next) => {
  const { firstName, lastName, age, gender, phone, role, email, password } =
    req.body;
  // check: email not exist
  const isUserExist = await findOne(userModel, { email });
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
  const user = await create(userModel, {
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
      expiresIn: Date.now() + 60 * 60 * 60 * 1000,
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
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // check: email existance
  const user = await findOne(userModel, { email });
  if (!user) {
    return successHandler({ res, message: "User not found", status: 404 });
  }
  // step: create token
  const userPayload = {
    id: user._id,
    email: user.email,
  };
  const jwtid = nanoid();
  const accessToken = jwt.sign(userPayload, process.env.ACCESS_SEGNATURE, {
    expiresIn: "1h",
    jwtid,
  });
  const refreshToken = jwt.sign(userPayload, process.env.REFRESH_SEGNATURE, {
    expiresIn: "7d",
    jwtid,
  });
  return successHandler({
    res,
    message: "Loggedin successfully",
    result: { accessToken, refreshToken },
  });
};

// refreshToken
export const refreshToken = async (req, res, next) => {
  const { authorization } = req.headers;
  // step: verify authorization
  const { user, payload } = await decodeToken(
    authorization,
    tokenTypes.refresh,
    next
  );
  // step: create accessToken
  const userPayload = {
    id: user._id,
    email: user.email,
  };
  const jwtid = nanoid();
  const accessToken = jwt.sign(userPayload, process.env.ACCESS_SEGNATURE, {
    expiresIn: "1h",
    jwtid,
  });
  // step: return access token
  return successHandler({ res, result: { accessToken } });
};

// confirmEmail
export const confirmEmail = async (req, res, next) => {
  const user = req.user;
  const { firstOtp, secondOtp } = req.body;
  // check: emailOtp
  if (!compare(firstOtp, user.emailOtp.otp)) {
    return successHandler({ res, message: "Invalid otp", status: 400 });
  }
  if (user.emailOtp.expiresIn < Date.now()) {
    return successHandler({ res, message: "otp expired", status: 400 });
  }
  // step: case 1 email not confrimed (confirm first email)
  if (!user.emailConfirmed) {
    // step: confirm email
    const updatedUser = await findOneAndUpdate(
      userModel,
      { email: user.email },
      { $set: { emailConfirmed: true } }
    );
    return successHandler({ res, message: "Email confirmed successfully" });
  }
  // step: case 2 email confrimed (confirm first and second email)
  if (user.emailConfirmed && secondOtp) {
    // check: newEmailOtp
    if (!compare(secondOtp, user.newEmailOtp.otp)) {
      return successHandler({
        res,
        message: "Invalid otp for second email",
        status: 400,
      });
    }
    if (user.newEmailOtp.expiresIn < Date.now()) {
      return successHandler({
        res,
        message: "otp expired for second email",
        status: 400,
      });
    }
    // step: confirm email
    const newEmail = user.newEmail;
    const updatedUser = await findOneAndUpdate(
      userModel,
      { email: user.email },
      { $set: { email: newEmail } }
    );
    return successHandler({ res, message: "New email confirmed successfully" });
  }
  // check: if emailConfirmed && !secondOtp
  if (user.emailConfirmed && !secondOtp) {
    return successHandler({
      res,
      message:
        "Email already confirmed, if you want to update email please send firstOtp and secondOtp",
      status: 400,
    });
  }
};

// updateEmail
export const updateEmail = async (req, res, next) => {
  const user = req.user;
  const { newEmail } = req.body;
  // check: if email confirmed
  if (!user.emailConfirmed) {
    return successHandler({
      res,
      message: "Please confirm email to update it",
      status: 400,
    });
  }
  // step: send otp to old email
  const otpCodeForOldEmail = createOtp();
  const { isEmailSended } = await sendEmail({
    to: user.email,
    subject: "ECommerceApp",
    html: template(otpCodeForOldEmail, user.firstName, "Confirm email"),
  });
  if (!isEmailSended) {
    return successHandler({
      res,
      message: "Error while checking email",
      status: 400,
    });
  }
  // step: send otp to new email
  const otpCodeForNewEmail = createOtp();
  isEmailSended = await sendEmail({
    to: newEmail,
    subject: "ECommerceApp",
    html: template(otpCodeForNewEmail, user.firstName, "Confirm new email"),
  });
  if (!isEmailSended) {
    return successHandler({
      res,
      message: "Error while checking email",
      status: 400,
    });
  }
  // step: save emailOtp, newEmail and newEmailOtp
  const updatedUser = await findOneAndUpdate(
    userModel,
    { email: user.email },
    {
      $set: {
        "emailOtp.otp": otpCodeForOldEmail,
        "emialOtp.expiresIn": Date.now() + 60 * 60 * 60 * 1000,
        newEmail,
        "newEmailOtp.otp": otpCodeForNewEmail,
        "newEmailOtp.expiresIn": Date.now() + 60 * 60 * 60 * 1000,
      },
    }
  );
  return successHandler({
    res,
    message: "Please confirm new email to save updates",
  });
};

// resendEmailOtp
export const resendEmailOtp = async (req, res, next) => {
  const user = req.user;
  // step: send otp to email
  const otpCode = createOtp();
  const { isEmailSended } = await sendEmail({
    to: user.email,
    subject: "ECommerceApp",
    html: template(otpCode, user.firstName, "Confirm email"),
  });
  if (!isEmailSended) {
    return successHandler({
      res,
      message: "Error while checking email",
      status: 400,
    });
  }
  // step: update emailOtp
  const updatedUser = await findOneAndUpdate(
    userModel,
    { email: user.email },
    {
      $set: {
        "emailOtp.otp": otpCode,
        expiresIn: Date.now() + 60 * 60 * 60 * 1000,
      },
    }
  );
  return successHandler({ res, message: "OTP sended successfully" });
};

// updatePassword
export const updatePassword = async (req, res, next) => {};

// changePassword
export const changePassword = async (req, res, next) => {};

// forgetPassword
export const forgetPassword = async (req, res, next) => {};

// resendPasswordOtp
export const resendPasswordOtp = async (req, res, next) => {};

// logout
export const logout = async (req, res, next) => {};
