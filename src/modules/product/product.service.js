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
export const searchByName = async (req, res, next) => {};

// searchBySeller
export const searchBySeller = async (req, res, next) => {};
