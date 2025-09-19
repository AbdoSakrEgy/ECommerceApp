export const emailConfirmed = async (req, res, next) => {
  const user = req.user;
  if (!user.emailConfirmed) {
    next(new Error("Email not confirmed"));
  }
  return next();
};
