import Joi from "joi";
import { Gender, Role } from "../user/user.model.js";

export const registerSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    age: Joi.number().min(18).max(200),
    gender: Joi.string().valid(Gender.male, Gender.female),
    phone: Joi.custom((value, helpers) => {
      const clean = value.replace(/[\s-]/g, "");
      const phoneRegex = /^\+?[1-9]\d{7,14}$/;
      if (!phoneRegex.test(clean)) {
        return helpers.error("any.invalid");
      }
      return clean;
    }),
    role: Joi.string().valid(Role.admin, Role.customer, Role.seller),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
};

export const refreshTokenSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).required(),
};

export const confirmEmailSchema = {
  body: Joi.object({
    firstOtp: Joi.string().required(),
    secondOtp: Joi.string(),
  }).required(),
};

export const updateEmailSchema = {
  body: Joi.object({
    newEmail: Joi.string().email().required(),
  }).required(),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }).required(),
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }).required(),
};

export const changePasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().required(),
  }).required(),
};
