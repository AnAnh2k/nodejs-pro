import { prisma } from "config/client";
import { log } from "console";

const getAllOrders = async () => {
  const allOrder = await prisma.order.findMany({
    include: {
      user: true,
    },
  });
  log("all", allOrder);
  return allOrder;
};

const getViewOrders = async (id: number) => {
  const allOrder = await prisma.orderDetail.findMany({
    where: {
      orderId: id,
    },
    include: {
      product: true,
    },
  });
  log("all", allOrder);
  return allOrder;
};
export { getAllOrders, getViewOrders };
