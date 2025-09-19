export const allowTo = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      return next(new Error("You are not authorized to access this end point"));
    }
    return next();
  };
};

export const notAllowTo = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      return next(new Error("You are not authorized to access this end point"));
    }
    return next();
  };
};
