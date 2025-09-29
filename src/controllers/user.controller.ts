import { Request, Response } from "express";
import {
  getAllUsers,
  handleCreateUser,
  handelDeleteUser,
  getUserByID,
  updateUserByID,
} from "services/user.service"; // <-- Sửa lại đường dẫn này
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
  const a = await handleCreateUser(fullname, email, address);

  return res.redirect("/");
};

const postDeleteUser = async (req: Request, res: Response) => {
  await handelDeleteUser(req.params.id);

  return res.redirect("/");
};

const getViewUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserByID(id);

  return res.render("view-user", { user: user }); // hoặc res.status(400).send("Missing user id");
};
const postUpdateUser = async (req: Request, res: Response) => {
  const { id, fullName, email, address } = req.body;
  //update user by id
  log("Updating user:", { id, fullName, email, address });
  const user = await updateUserByID(id, fullName, email, address);

  return res.redirect("/");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
};
