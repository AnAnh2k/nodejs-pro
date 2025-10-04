import e, { Request, Response } from "express";

const getRegisterPage = async (req: Request, res: Response) => {
  return res.render("client/auth/register");
};

const getLoginPage = async (req: Request, res: Response) => {
  return res.render("client/auth/login");
};

export { getRegisterPage, getLoginPage };
