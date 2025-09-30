import { Request, Response } from "express";
import {
  getAllUsers,
  handleCreateUser,
  handelDeleteUser,
  getUserByID,
  updateUserByID,
  getAllRole,
} from "services/user.service"; // <-- Sửa lại đường dẫn này
import { log } from "console";

const getHomePage = async (req: Request, res: Response) => {
  //get user
  const users = await getAllUsers();

  return res.render("home", { users: users });
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
  const user = await getUserByID(id);

  return res.render("admin/user/view", { user: user, roles: roles }); // hoặc res.status(400).send("Missing user id");
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

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
};
