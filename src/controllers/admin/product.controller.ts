import { log } from "console";
import e, { Request, Response } from "express";
import {
  getProductByID,
  handelDeleteProduct,
  handleCreateProduct,
  updateProductByID,
} from "services/admin/product.service";
import { addProductToCart } from "services/client/item.service";
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

const postAdminCreateProductPage = async (req, res) => {
  const { name, price, shortDesc, detailDesc, quantity, factory, target } =
    req.body as TProductSchema;
  const image = req.file ? req.file.filename : "productDefault.png";

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
  const a = await handleCreateProduct(
    name,
    +price,
    image,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target
  );

  return res.redirect("/admin/product");
};

const getViewProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const errors = [];

  //todo
  const factoryOptions = [
    { name: "Apple (MacBook)", value: "APPLE" },
    { name: "Asus", value: "ASUS" },
    { name: "Lenovo", value: "LENOVO" },
    { name: "Dell", value: "DELL" },
    { name: "LG", value: "LG" },
    { name: "Acer", value: "ACER" },
  ];

  const targetOptions = [
    { name: "Gaming", value: "GAMING" },
    { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
    { name: "Thiết kế đồ hoạ", value: "THIET-KE-DO-HOA" },
    { name: "Mỏng nhẹ", value: "MONG-NHE" },
    { name: "Doanh nhân", value: "DOANH-NHAN" },
  ];

  const product = await getProductByID(id);

  return res.render("admin/product/view", {
    product: product,
    factoryOptions: factoryOptions,
    targetOptions: targetOptions,
    errors: errors,
  }); // hoặc res.status(400).send("Missing user id");
};

const postUpdateProduct = async (req: Request, res: Response) => {
  const { id, name, price, shortDesc, detailDesc, quantity, factory, target } =
    req.body as TProductSchema;
  //update user by id
  const file = req.file;
  const image = file?.filename;
  //validate
  const validate = ProductSchema.safeParse(req.body);
  const product = {
    id,
    name,
    price,
    shortDesc,
    detailDesc,
    quantity,
    factory,
    target,
  };

  const factoryOptions = [
    { name: "Apple (MacBook)", value: "APPLE" },
    { name: "Asus", value: "ASUS" },
    { name: "Lenovo", value: "LENOVO" },
    { name: "Dell", value: "DELL" },
    { name: "LG", value: "LG" },
    { name: "Acer", value: "ACER" },
  ];

  const targetOptions = [
    { name: "Gaming", value: "GAMING" },
    { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
    { name: "Thiết kế đồ hoạ", value: "THIET-KE-DO-HOA" },
    { name: "Mỏng nhẹ", value: "MONG-NHE" },
    { name: "Doanh nhân", value: "DOANH-NHAN" },
  ];

  if (!validate.success) {
    //error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message}: (${item.path[0]})`
    );

    return res.render("admin/product/view", {
      errors,
      product,
      factoryOptions,
      targetOptions,
    });
  }
  const a = await updateProductByID(
    id,
    name,
    +price,
    image,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target
  );
  return res.redirect("/admin/product");
};

const postDeleteProduct = async (req: Request, res: Response) => {
  await handelDeleteProduct(req.params.id);

  return res.redirect("/admin/product");
};

const postAddToCartFromDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }
  await addProductToCart(+quantity, +id, user);
  return res.redirect(`/product/${id}`);
};

export {
  getAdminCreateProductPage,
  postAdminCreateProductPage,
  getViewProduct,
  postUpdateProduct,
  postDeleteProduct,
  postAddToCartFromDetailPage,
};
