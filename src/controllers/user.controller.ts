import { log } from "console";
import { Request, Response } from "express";
import { handelCreateUser } from "../services/user.service";

const getHomePage = (req: Request, res: Response) => {
  return res.render("home");
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
