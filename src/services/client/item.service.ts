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
      },
    });

    //cậpnhật cart detail
    //nếu chưa có thì tạo mới
    //nếu có rồi thì cập nhật số lượng
    // update + insert = upsert

    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        cartId: cart.id,
        productId: productID,
      },
    });
    await prisma.cartDetail.upsert({
      where: {
        id: currentCartDetail ? currentCartDetail.id : 0,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId: productID,
        quantity: quantity,
        price: product.price,
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

const getCartDetail = async (id: number) => {
  const userByID = await prisma.cart.findUnique({
    where: {
      userId: id,
    },
  });
  if (userByID) {
    const cartDetailByID = await prisma.cartDetail.findMany({
      where: {
        cartId: userByID?.id,
      },
      include: {
        product: true,
      },
    });
    return cartDetailByID;
  }
  return [];
};

const deleteProductInCart = async (
  cartDetailID: number,
  userID: number,
  sumCart: number
) => {
  const cartDetail = await prisma.cartDetail.delete({
    where: {
      id: cartDetailID,
    },
  });
  if (sumCart <= cartDetail.quantity) {
    //delete cart
    await prisma.cart.delete({
      where: { userId: userID },
    });
  } else {
    //update cart
    await prisma.cart.update({
      where: { userId: userID },
      data: {
        sum: {
          decrement: cartDetail.quantity,
        },
      },
    });
  }
};

export {
  getProducts,
  getProductByID,
  addProductToCart,
  getCartDetail,
  deleteProductInCart,
};
