import bcrypt from "bcrypt";

export const hash = async (plainText) => {
  return await bcrypt.hash(plainText, Number(process.env.SALAT));
};

export const compare = async (plainText, hashedText) => {
  return await bcrypt.compare(plainText, hashedText);
};
