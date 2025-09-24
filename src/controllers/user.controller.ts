import { log } from "console";
import { Request, Response } from "express";
import { getAllUsers, handelCreateUser } from "../services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  //get user
  const user = await getAllUsers();
  console.log(">>> check user: ", user);
  return res.render("home", { name: user });
};

const getCreateUserPage = (req: Request, res: Response) => {
  return res.render("create-user");
};

const postCreateUser = (req: Request, res: Response) => {
  const { fullname, email, address } = req.body;
  handelCreateUser(fullname, email, address);

  return res.redirect("/");
};

export { getHomePage, getCreateUserPage, postCreateUser };
