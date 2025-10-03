import { Product } from ".prisma/client";
import { prisma } from "config/client";

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

const getAllProducts = async () => {
  const allProduct = await prisma.product.findMany();
  return allProduct;
};

export { handleCreateProduct, getAllProducts };
