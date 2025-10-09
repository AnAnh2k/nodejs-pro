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

const addProductToCart = async (
  quantity: number,
  productID: number,
  user: Express.User
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  const product = await prisma.product.findUnique({
    where: { id: productID },
  });

  if (cart) {
    //update cart
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: cart.sum + quantity,
        cartDetails: {
          create: [
            {
              productId: product.id,
              quantity: quantity,
              price: product.price,
            },
          ],
        },
      },
    });
  } else {
    //create cart
    await prisma.cart.create({
      data: {
        userId: user.id,
        sum: quantity,
        cartDetails: {
          create: [
            {
              productId: product.id,
              quantity: quantity,
              price: product.price,
            },
          ],
        },
      },
    });
  }
};

export { getProducts, getProductByID, addProductToCart };
