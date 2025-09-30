import e, { Request, Response } from "express";

const getAdminCreateProductPage = (req, res) => {
  return res.render("admin/product/create");
};

const postAdminCreateProductPage = (req, res) => {
  const { name, price, shortDesc, quantity } = req.body;
  const image = req.file ? req.file.filename : null;
  return res.redirect("admin/product");
};

export { getAdminCreateProductPage, postAdminCreateProductPage };
