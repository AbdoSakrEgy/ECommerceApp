import { findOne } from "../DB/db.services.js";
import userModel from "../modules/user/user.model.js";
import jwt from "jsonwebtoken";

export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};
Object.freeze(tokenTypes);

export const decodeToken = async (authorization, tokenType, next) => {
  // check: bearer key
  if (!authorization.startsWith(process.env.BEARER_KEY)) {
    return next(new Error("Invalid bearer key"));
  }
  // check: token validation
  let [bearer, token] = authorization.split(" ");
  let segnature = "";
  if (tokenType == tokenTypes.access) {
    segnature = process.env.ACCESS_SEGNATURE;
  } else if (tokenType == tokenTypes.refresh) {
    segnature = process.env.REFRESH_SEGNATURE;
  }
  let payload = jwt.verify(token, segnature); // result || error
  // check: user existance
  const user = await findOne(userModel, { _id: payload.id });
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
