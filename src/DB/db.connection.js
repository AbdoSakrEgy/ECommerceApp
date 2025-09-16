import mongoose from "mongoose";

export const DBConnection = async () => {
  await mongoose
    .connect(process.env.MONGODBCOMPASS_URL)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log("Unable to connect DB \n", err);
    });
};
