import CryptoJS from "crypto-js";

export const encrypt = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, process.env.PRIVATE_KEY).toString();
};
export const decrypt = (cyphertext) => {
  return CryptoJS.AES.decrypt(cyphertext, process.env.PRIVATE_KEY).toString(
    CryptoJS.enc.Utf8
  );
};
