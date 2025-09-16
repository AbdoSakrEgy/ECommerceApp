import bcrypt from "bcrypt";

export const hash = (plainText) => {
  return bcrypt.hashSync(plainText, Number(process.env.SALAT));
};

export const compare = (plainText, hashedText) => {
  return bcrypt.compareSync(plainText, hashedText);
};
