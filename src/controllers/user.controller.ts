import { Request, Response } from "express";
import {
  getAllUsers,
  handleCreateUser,
  handelDeleteUser,
  getlUserByID,
} from "../services/user.service"; // <-- Sửa lại đường dẫn này
import { log } from "console";

const getHomePage = async (req: Request, res: Response) => {
  //get user
  const users = await getAllUsers();

  return res.render("home", { users: users });
};

const getCreateUserPage = (req: Request, res: Response) => {
  return res.render("create-user");
};

const postCreateUser = async (req: Request, res: Response) => {
  const { fullname, email, address } = req.body;
  await handleCreateUser(fullname, email, address);

  return res.redirect("/");
};

const postDeleteUser = async (req: Request, res: Response) => {
  await handelDeleteUser(req.params.id);

  return res.redirect("/");
};

const getViewUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getlUserByID(id);
  log(user);
  return res.render("view-user", { user: user[0] }); // hoặc res.status(400).send("Missing user id");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
};
