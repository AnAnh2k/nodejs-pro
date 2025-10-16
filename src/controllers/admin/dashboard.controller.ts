import e, { Request, Response } from "express";
import { getDashBoardInfo } from "services/admin/dashboard.service";
import {
  countToTalOrderPages,
  getAllOrders,
} from "services/admin/order.service";
import {
  countToTalProductPages,
  getAllProducts,
} from "services/admin/product.service";
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
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = await countToTalProductPages();
  const products = await getAllProducts(currentPage);
  return res.render("admin/product/show", {
    products,
    totalPages: +totalPages,
    page: +currentPage,
  });
};

const getAdminOrderPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = await countToTalOrderPages();
  const orders = await getAllOrders(currentPage);
  //get user
  return res.render("admin/order/show", {
    orders,
    totalPages: +totalPages,
    page: +currentPage,
  });
};

export {
  getDashboardPage,
  getAdminUserPage,
  getAdminOrderPage,
  getAdminProductPage,
};
