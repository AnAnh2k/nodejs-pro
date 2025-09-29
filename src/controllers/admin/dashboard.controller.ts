import e, { Request, Response } from "express";

const getDashboardPage = async (req: Request, res: Response) => {
  //get user
  return res.render("admin/dashboard/show");
};

const getAdminUserPage = async (req: Request, res: Response) => {
  //get user
  return res.render("admin/user/show");
};

export { getDashboardPage, getAdminUserPage };
