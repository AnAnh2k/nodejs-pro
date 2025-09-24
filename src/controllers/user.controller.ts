import { log } from "console";
import { Request, Response } from "express";
import {
  getAllUsers,
  handelCreateUser,
  handelDeleteUser,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  //get user
  const users = await getAllUsers();
  console.log(">>> check user: ", users);
  return res.render("home", { users: users });
};

const getCreateUserPage = (req: Request, res: Response) => {
  return res.render("create-user");
};

const postCreateUser = async (req: Request, res: Response) => {
  const { fullname, email, address } = req.body;
  await handelCreateUser(fullname, email, address);

  return res.redirect("/");
};

const postDeleteUser = async (req: Request, res: Response) => {
  await handelDeleteUser(req.params.id);

  return res.redirect("/");
};

export { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser };
