import { decodeToken, tokenTypes } from "../utils/decodeToken.js";

export const auth = (role) => {
  return async (req, res, next) => {
    // check: authorization
    const { authorization } = req.headers;
    const { user, payload } = await decodeToken(
      authorization,
      tokenTypes.access,
      role,
      next
    );
    // step: modify req
    req.user = user;
    req.payload = payload;
    return next();
  };
};
