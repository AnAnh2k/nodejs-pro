import e, { Request, Response } from "express";
import { getAllOrders, getViewOrders } from "services/admin/order.service";

const getViewOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderDetails = await getViewOrders(+id);
  return res.render("admin/order/view", { orderDetails });
};
export { getViewOrder };
