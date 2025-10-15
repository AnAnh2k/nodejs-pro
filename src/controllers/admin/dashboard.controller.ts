import e, { Request, Response } from "express";
import { getDashBoardInfo } from "services/admin/dashboard.service";
import { getAllOrders } from "services/admin/order.service";
import { getAllProducts } from "services/admin/product.service";
import { countToTalUserPages, getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  //get user
  const info = await getDashBoardInfo();
  return res.render("admin/dashboard/show", { info });
};

const getAdminUserPage = async (req: Request, res: Response) => {
  //get user
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = await countToTalUserPages();
  const users = await getAllUsers(currentPage);
  return res.render("admin/user/show", {
    users: users,
    totalPages: +totalPages,
    page: +currentPage,
  });
};

const getAdminProductPage = async (req: Request, res: Response) => {
  //get product
  const products = await getAllProducts();
  return res.render("admin/product/show", { products });
};

const getAdminOrderPage = async (req: Request, res: Response) => {
  const orders = await getAllOrders();
  //get user
  return res.render("admin/order/show", { orders });
};

export {
  getDashboardPage,
  getAdminUserPage,
  getAdminOrderPage,
  getAdminProductPage,
};
