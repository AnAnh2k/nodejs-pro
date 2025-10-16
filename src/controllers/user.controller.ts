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
  return res.render("client/product/filter", {
    products: products,
    totalPages: +totalPages,
    page: +currentPage,
  });
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
