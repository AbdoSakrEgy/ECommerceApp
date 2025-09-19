import { find, findOne } from "../../DB/db.services.js";
import { successHandler } from "../../utils/successHandler.js";
import userModel from "../user/user.model.js";
import productModel from "./product.model.js";

// viewProducts
export const viewProducts = async (req, res, next) => {
  const prodoucts = await find(productModel);
  if (prodoucts.length == 0) {
    successHandler({
      res,
      message: "No products to view",
      result: { prodoucts },
    });
  }
  successHandler({
    res,
    result: { prodoucts },
  });
};

// searchByName
export const searchByName = async (req, res, next) => {
  const { productName } = req.params;
  const products = await find(productModel, { name: productName });
  if (products.length == 0) {
    return successHandler({ res, message: "No products with this name" });
  }
  return successHandler({ res, result: { products } });
};

// searchBySeller
export const searchBySeller = async (req, res, next) => {
  const { sellerId } = req.params;
  // step: check is seller exist
  const seller = await findOne(userModel, { _id: sellerId, role: "seller" });
  if (!seller) {
    return successHandler({ res, message: "Seller not found", status: 404 });
  }
  // step: display his products
  const products = await find(productModel, { sellerId: sellerId });
  if (products.length == 0) {
    return successHandler({
      res,
      message: "The seller don't has avilable products now",
    });
  }
  return successHandler({ res, result: { products } });
};
