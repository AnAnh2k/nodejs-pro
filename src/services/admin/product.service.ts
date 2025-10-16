import { Product } from ".prisma/client";
import { prisma } from "config/client";
import { TOTAL_ITEMs_PER_PAGE } from "config/constant";
import { log } from "console";

const handleCreateProduct = async (
  name: string,
  price: number,
  image: string,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string
) => {
  //insert to database

  // Using placeholders
  const newUer = await prisma.product.create({
    data: {
      name: name,
      price: price,
      image: image,
      detailDesc: detailDesc,
      shortDesc: shortDesc,
      quantity: quantity,
      factory: factory,
      target: target,
    },
  });
  return newUer;
};

const getAllProducts = async (page: number) => {
  const pageSize = TOTAL_ITEMs_PER_PAGE;
  const skip = (page - 1) * pageSize;
  const allProduct = await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
  return allProduct;
};
const countToTalProductPages = async () => {
  const pageSize = TOTAL_ITEMs_PER_PAGE;

  const totalItems = await prisma.product.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  return totalPages;
};

const getProductByID = async (id: string) => {
  const productByID = await prisma.product.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return productByID;
};

const updateProductByID = async (
  id: string,
  name: string,
  price: number,
  image: string,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string
) => {
  // const defaultPassword = await hashPassword(password ?? "123456");

  const newUer = await prisma.product.update({
    where: {
      id: +id,
    },
    data: {
      name: name,
      price: price,
      ...(image !== undefined && { image: image }),
      detailDesc: detailDesc,
      shortDesc: shortDesc,
      quantity: quantity,
      factory: factory,
      target: target,
    },
  });
  log("Updated product:", newUer);
  return newUer;
};

const handelDeleteProduct = async (id: string) => {
  const productDelete = await prisma.product.delete({
    where: {
      id: +id,
    },
  });
  log("Fetched user dl ID:", productDelete);
  return productDelete;
};

export {
  handleCreateProduct,
  getAllProducts,
  getProductByID,
  updateProductByID,
  handelDeleteProduct,
  countToTalProductPages,
};
