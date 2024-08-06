import { productModel } from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find({}, { _id: 0, __v: 0 }).lean();
    // const user = req.session.user;
    res.render("products", {
      title: "All products",
      allProducts,
      // user,
    });
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
};
