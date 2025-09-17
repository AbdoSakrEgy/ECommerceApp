export const successHandler = ({
  res,
  message = "Done",
  status = 200,
  result = {},
}) => {
  return res.status(status).json({ message, status, result });
};
