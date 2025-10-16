import { prisma } from "config/client";
import { TOTAL_ITEMs_PER_PAGE } from "config/constant";
import { log } from "console";

const getAllOrders = async (page: number) => {
  const pageSize = TOTAL_ITEMs_PER_PAGE;
  const skip = (page - 1) * pageSize;
  const allOrder = await prisma.order.findMany({
    skip: skip,
    take: pageSize,
    include: {
      user: true,
    },
  });
  log("all", allOrder);
  return allOrder;
};

const countToTalOrderPages = async () => {
  const pageSize = TOTAL_ITEMs_PER_PAGE;

  const totalItems = await prisma.order.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  return totalPages;
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
export { getAllOrders, getViewOrders, countToTalOrderPages };
