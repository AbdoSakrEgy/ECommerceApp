export const successHandler = ({
  res,
  message = "",
  status = 200,
  result = {},
}) => {
  return res.status(status).json({ message, status, result });
};
