import e, { Request, Response } from "express";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getAdminCreateProductPage = (req, res) => {
  return res.render("admin/product/create");
};

const postAdminCreateProductPage = (req, res) => {
  const { name, price, shortDesc, quantity } = req.body as TProductSchema;
  const image = req.file ? req.file.filename : null;
  try {
    const result = ProductSchema.parse(req.body);
    console.log("run ok", result);
  } catch (error) {
    console.log(error);
  }

  return res.redirect("/admin/product");
};

export { getAdminCreateProductPage, postAdminCreateProductPage };
