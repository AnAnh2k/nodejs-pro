import { Request, Response } from "express";
import {
  getAllUsers,
  handleCreateUser,
  handelDeleteUser,
  getUserByID,
  updateUserByID,
  getAllRole,
  getUserByIDClient,
} from "services/user.service"; // <-- Sửa lại đường dẫn này
import { log } from "console";
import { get } from "http";
import {
  countToTalProductCLientPages,
  getProducts,
} from "services/client/item.service";
import {
  productFilterFactories,
  productFilterFactory,
  productFilterMax,
  productFilterMin,
  productFilterPricev1,
  productFilterPricev2,
  productSortv1,
  userFilter,
} from "services/client/product.filter";

const getHomePage = async (req: Request, res: Response) => {
  const user = req.user;
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = await countToTalProductCLientPages(8);
  const products = await getProducts(currentPage, 8);
  return res.render("client/home/show", {
    products: products,
    user: user,
    totalPages: +totalPages,
    page: +currentPage,
  });
};

const getProductFilterPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = await countToTalProductCLientPages(6);
  const products = await getProducts(currentPage, 6);
  // return res.render("client/product/filter", {
  //   products: products,
  //   totalPages: +totalPages,
  //   page: +currentPage,
  // });

  // --- Lọc User theo username ---
  // URL ví dụ: /users?username=admin
  //
  // const { username } = req.query;
  // const users = await userFilter(username as string);
  // res.json(users);

  //================================================================
  // TRONG CONTROLLER XỬ LÝ PRODUCT (ví dụ: /products)
  //================================================================

  // --- YC 1: Lọc giá thấp nhất (minPrice) ---
  // URL ví dụ: /products?minPrice=15000000
  //
  // const { minPrice } = req.query;
  // const productsMin = await productFilterMin(Number(minPrice));
  // res.status(200).json({ data: productsMin });

  // --- YC 2: Lọc giá cao nhất (maxPrice) ---
  // URL ví dụ: /products?maxPrice=15000000
  //
  // const { maxPrice } = req.query;
  // const productsMax = await productFilterMax(Number(maxPrice));
  // res.status(200).json({ data: productsMax });

  // --- YC 3: Lọc theo 1 nhà sản xuất (factory) ---
  // URL ví dụ: /products?factory=APPLE
  //
  // const { factory } = req.query;
  // const productsFactory = await productFilterFactory(factory as string);
  // res.status(200).json({ data: productsFactory });

  // --- YC 4: Lọc theo nhiều nhà sản xuất (factories) ---
  // URL ví dụ: /products?factories=APPLE,DELL
  //
  // const { factories } = req.query;
  // const productsFactories = await productFilterFactories(factories as string);
  // res.status(200).json({ data: productsFactories });

  // --- YC 5: Lọc theo 1 khoảng giá (price) ---
  // URL ví dụ: /products?price=10-toi-20-trieu
  //
  // const { price } = req.query;
  // const productsPriceV1 = await productFilterPricev1(price as string);
  // res.status(200).json({ data: productsPriceV1 });

  // --- YC 6: Lọc theo nhiều khoảng giá (price) ---
  // URL ví dụ: /products?price=10-toi-20-trieu,30-toi-40-trieu
  //
  // const { price } = req.query; // (Trùng tên param với YC5, chỉ để ví dụ)
  // const productsPriceV2 = await productFilterPricev2(price as string);
  // res.status(200).json({ data: productsPriceV2 });

  // --- YC 7: Sắp xếp (sort) ---
  // URL ví dụ: /products?sort=price,asc
  //
  const { sort } = req.query;
  const productsSorted = await productSortv1(sort as string);
  res.status(200).json({ data: productsSorted });
};

const getCreateUserPage = async (req: Request, res: Response) => {
  const roles = await getAllRole();
  return res.render("admin/user/create", { roles: roles });
};

const postCreateUser = async (req: Request, res: Response) => {
  const { fullName, username, password, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? "avatar-default.png";

  const a = await handleCreateUser(
    fullName,
    username,
    password,
    phone,
    role,
    address,
    avatar
  );

  return res.redirect("/admin/user");
};

const postDeleteUser = async (req: Request, res: Response) => {
  await handelDeleteUser(req.params.id);

  return res.redirect("/admin/user");
};

const getViewUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const roles = await getAllRole();
  const user = await getUserByID(+id);

  return res.render("admin/user/view", { user: user, roles: roles }); // hoặc res.status(400).send("Missing user id");
};

const getUserClient = async (req: Request, res: Response) => {
  const { id } = req.user;
  const roles = await getAllRole();
  const user = await getUserByIDClient(+id);

  return res.render("client/user/view", { user: user, roles: roles }); // hoặc res.status(400).send("Missing user id");
};

const postUpdateUser = async (req: Request, res: Response) => {
  const { id, fullName, phone, role, address } = req.body;
  log("Update user id:", req.body);
  //update user by id
  const file = req.file;
  const avatar = file?.filename;
  log("Update user avatar:", avatar);
  const a = await updateUserByID(
    id,
    fullName,

    phone,
    role,
    address,
    avatar
  );
  log("Update user:", a);
  return res.redirect("/admin/user");
};

const postUpdateUserClient = async (req: Request, res: Response) => {
  const { id, fullName, phone, role, address } = req.body;
  log("Update user id:", req.body);
  //update user by id
  const file = req.file;
  const avatar = file?.filename;
  log("Update user avatar:", avatar);
  const a = await updateUserByID(
    id,
    fullName,

    phone,
    role,
    address,
    avatar
  );
  log("Update user:", a);
  return res.redirect("/user");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
  getUserClient,
  postUpdateUserClient,
  getProductFilterPage,
};
