import { decodeToken, tokenTypes } from "../utils/decodeToken.js";

export const auth = async (req, res, next) => {
  // check: authorization
  const { authorization } = req.headers;
  const { user, payload } = await decodeToken(
    authorization,
    tokenTypes.access,
    next
  );
  // step: modify req
  req.user = user;
  req.payload = payload;
  return next();
};
