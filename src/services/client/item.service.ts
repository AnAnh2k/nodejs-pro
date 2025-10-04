import { prisma } from "config/client";

const getProducts = async () => {
  const product = await prisma.product.findMany();
  return product;
};

const getProductByID = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
};

export { getProducts, getProductByID };
