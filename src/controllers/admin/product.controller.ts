import e, { Request, Response } from "express";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getAdminCreateProductPage = (req, res) => {
  const errors = [];
  const oldData = {
    name: "",
    price: "",
    shortDesc: "",
    detailDesc: "",
    quantity: "",
    factory: "",
    target: "",
  };
  return res.render("admin/product/create", { errors, oldData });
};

const postAdminCreateProductPage = (req, res) => {
  const { name, price, shortDesc, detailDesc, quantity, factory, target } =
    req.body as TProductSchema;
  const image = req.file ? req.file.filename : null;

  const validate = ProductSchema.safeParse(req.body);
  if (!validate.success) {
    //error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message}: (${item.path[0]})`
    );
    const oldData = {
      name,
      price,
      shortDesc,
      detailDesc,
      quantity,
      factory,
      target,
    };
    return res.render("admin/product/create", { errors, oldData });
  }
  //success

  return res.redirect("/admin/product");
};

export { getAdminCreateProductPage, postAdminCreateProductPage };
