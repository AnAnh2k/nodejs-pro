import e, { Request, Response } from "express";
import { getAllOrders } from "services/admin/order.service";
import { getAllProducts } from "services/admin/product.service";
import { getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  //get user

  return res.render("admin/dashboard/show");
};

const getAdminUserPage = async (req: Request, res: Response) => {
  //get user
  const users = await getAllUsers();
  return res.render("admin/user/show", { users: users });
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
