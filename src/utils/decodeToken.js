import { findOne } from "../DB/db.services.js";
import adminModel, { Role } from "../modules/admin/admin.model.js";
import customerModel from "../modules/customer/customer.model.js";
import sellerModel from "../modules/seller/seller.model.js";
import jwt from "jsonwebtoken";

export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};
Object.freeze(tokenTypes);

export const decodeToken = async (authorization, tokenType, role, next) => {
  // check: bearer key
  if (authorization.startsWith(process.env.BEARER_KEY)) {
    return next(new Error("Invalid bearer key"));
  }
  // check: token validation
  let [bearer, token] = authorization.split(" ");
  let segnature = "";
  let model;
  if (tokenType == tokenTypes.access) {
    segnature = process.env.ACCESS_SEGNATURE;
  } else if (tokenType == tokenTypes.refresh) {
    segnature = process.env.REFRESH_SEGNATURE;
  }
  if (role == Role.admin) {
    model = adminModel;
  } else if (role == Role.customer) {
    model = customerModel;
  } else if (role == Role.seller) {
    model = sellerModel;
  }
  let payload = jwt.verify(token, segnature); // result || error
  // check: user existance
  const user = await findOne(model, { _id: payload.id });
  if (!user) {
    return next(new Error("User not found"));
  }
  // check: credentials changing
  if (user.credentialsChangedAt) {
    if (user.credentialsChangedAt.getTime() > payload.iat * 1000) {
      return next(new Error("You have to login again"));
    }
  }
  // step: return user & payload
  return { user, payload };
};
