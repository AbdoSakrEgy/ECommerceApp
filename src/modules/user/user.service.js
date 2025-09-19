import {
  create,
  find,
  findOne,
  findOneAndUpdate,
} from "../../DB/db.services.js";
import { successHandler } from "../../utils/successHandler.js";
import productModel, { ProductStatus } from "../product/product.model.js";
import userModel from "./user.model.js";

// ==================== admin,customer,seller ====================
// updatePersonalInfo
export const updatePersonalInfo = async (req, res, next) => {
  const user = req.user;
  const { firstName, lastName, age, gender, phone } = req.body;
  const updateUser = await findOneAndUpdate(
    userModel,
    { email: user.email },
    { firstName, lastName, age, gender, phone }
  );
  return successHandler({ res, message: "User info updated successfully" });
};

// ==================== admin ====================
// ==================== customer ====================
// addProductToCart
export const addProductToCart = async (req, res, next) => {
  const user = req.user;
  let cart = user.cart;
  let productToAdd = req.body; // {productId,quantity}
  let newCart = [];
  // step: check productToAdd existance in productsModel
  const isProductExist = await findOne(productModel, {
    _id: productToAdd.productId,
  });
  let productExist = isProductExist;
  if (!isProductExist) {
    return successHandler({ res, message: "Product not found", status: 404 });
  }
  // step: check productToAdd existance in cart
  let isProductExistInCart = false;
  let productExistInCart;
  cart.map((item) => {
    if (item.productId.equals(productToAdd.productId)) {
      isProductExistInCart = true;
      productExistInCart = item;
    }
  });
  // step: check quantity
  if (productToAdd.quantity > isProductExist.stock) {
    return successHandler({
      res,
      message: "Quantity not avilable",
      status: 400,
    });
  }
  // step: push to newCart
  if (!isProductExistInCart) {
    newCart.push(productToAdd);
  } else if (isProductExistInCart) {
    newCart.push({
      productId: productToAdd.productId,
      quantity: productToAdd.quantity + productExistInCart.quantity,
    });
  }
  // step: decrease stock in productModel
  await findOneAndUpdate(
    productModel,
    { _id: isProductExist._id },
    {
      $set: { stock: isProductExist.stock - productToAdd.quantity },
    }
  );
  // step: update cart
  await findOneAndUpdate(userModel, { _id: user._id }, { cart: newCart });
  return successHandler({ res, message: "Product added successfully" });
};

// deleteProductFromCart
export const deleteProductFromCart = async (req, res, next) => {
  const user = req.user;
  const productToRemove = req.body; // {productId,quantity}
  let cart = user.cart;
  let newCart = [];
  // step: check existance in products and in cart
  const isProductExist = await findOne(productModel, {
    _id: productToRemove.productId,
  });
  const productExist = isProductExist;
  if (!isProductExist) {
    return successHandler({ res, message: "Product not found", status: 404 });
  }
  let isProductExistInCart = false;
  let productExistInCart;
  for (const i of cart) {
    if (i.productId.equals(productToRemove.productId)) {
      isProductExistInCart = true;
      productExistInCart = i;
    }
  }
  if (!isProductExistInCart) {
    return successHandler({ res, message: "Product not found", status: 404 });
  }
  // step: check quantity
  if (productToRemove.quantity > productExistInCart.quantity) {
    return successHandler({
      res,
      message: "Quantity not avilable to remove",
      status: 400,
    });
  }
  // step: remove from cart
  cart.map((item) => {
    if (item.productId.equals(productToRemove.productId)) {
      if (item.quantity - productToRemove.quantity > 0) {
        newCart.push({
          productId: item.productId,
          quantity: item.quantity - productToRemove.quantity,
        });
      }
    } else {
      newCart.push(item);
    }
  });
  // update cart and products
  await findOneAndUpdate(userModel, { _id: user._id }, { cart: newCart });
  await findOneAndUpdate(
    productModel,
    { _id: productToRemove.productId },
    { stock: productExist.stock + productToRemove.quantity }
  );
  // step: return result
  return successHandler({ res, message: "Product removed successfully" });
};

// deleteCart
export const deleteCart = async (req, res, next) => {
  const user = req.user;
  await findOneAndUpdate(userModel, { _id: user._id }, { $set: { cart: [] } });
  return successHandler({ res, message: "Cart cleared successfully" });
};

// createOrder
export const createOrder = async (req, res, next) => {};

// ==================== seller ====================
// createMyProduct
export const createMyProduct = async (req, res, next) => {
  const user = req.user;
  const {
    name,
    category,
    originPrice,
    discount,
    subCategory,
    description,
    images,
    stock,
  } = req.body;
  const product = await create(productModel, {
    name,
    category,
    originPrice,
    discount,
    subCategory,
    description,
    images,
    stock,
    sellerId: user._id,
    createdBy: user._id,
  });
  successHandler({
    res,
    message: "Product added successfully",
    result: product,
  });
};

// readMyProducts
export const readMyProducts = async (req, res, next) => {
  const user = req.user;
  const myProducts = await find(productModel, { sellerId: user._id });
  if (myProducts.length == 0) {
    successHandler({
      res,
      message: "This seller not has products to view",
      result: { myProducts },
    });
  }
  successHandler({
    res,
    result: { myProducts },
  });
};

// updateMyProduct
export const updateMyProduct = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const {
    name,
    category,
    subCategory,
    description,
    images,
    originPrice,
    discount,
  } = req.body;
  // step: check existance
  const isProductExist = await findOne(productModel, {
    _id: id,
    sellerId: user._id,
  });
  if (!isProductExist) {
    return successHandler({ res, message: "Product not found", status: 404 });
  }
  // step: update
  await findOneAndUpdate(
    productModel,
    {
      _id: id,
      sellerId: user._id,
    },
    {
      name,
      category,
      subCategory,
      description,
      images,
      originPrice,
      discount,
      updatedBy: user._id,
    }
  );
  return successHandler({ res, message: "Product updated successfully" });
};

// deleteMyProduct
export const deleteMyProduct = async (req, res, next) => {};
