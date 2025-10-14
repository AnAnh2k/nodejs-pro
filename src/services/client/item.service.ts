import { log } from "console";
import { Cart } from "./../../../node_modules/.prisma/client/index.d";
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

const updateCartDetailBeforeCheckOut = async (
  data: { id: string; quantity: string }[],
  cartId: string
) => {
  let quantity = 0;
  for (let i = 0; i < data.length; i++) {
    quantity += +data[i].quantity;
    await prisma.cartDetail.update({
      where: {
        id: +data[i].id,
      },
      data: {
        quantity: +data[i].quantity,
      },
    });
  }

  //update cart sum
  await prisma.cart.update({
    where: {
      id: +cartId,
    },
    data: {
      sum: quantity,
    },
  });
};

const handlerPlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: string
) => {
  //tạo transaction
  try {
    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          cartDetails: true,
        },
      });

      if (cart) {
        //create order
        const dataOrderDetail =
          cart.cartDetails?.map((item) => ({
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
          })) ?? [];
        await tx.order.create({
          data: {
            receiverName,
            receiverAddress,
            receiverPhone,
            paymentMethod: "COD",
            paymentStatus: "PAYMENT_UNPAID",
            status: "PENDING",
            totalPrice: +totalPrice,
            userId,
            orderDetails: {
              create: dataOrderDetail,
            },
          },
        });

        //remove cart detail + cart
        await tx.cartDetail.deleteMany({
          where: { cartId: cart.id },
        });

        //remove cart
        await tx.cart.delete({
          where: { id: cart.id },
        });
        //check product
        for (let i = 0; i < cart.cartDetails.length; i++) {
          const productId = cart.cartDetails[i].productId;
          const product = await tx.product.findUnique({
            where: {
              id: productId,
            },
          });
          if (!product || product.quantity < cart.cartDetails[i].quantity) {
            throw new Error(
              `Sản phẩm ${product?.name} không tồn tại hoặc không đủ số lượng`
            );
          }
          await tx.product.update({
            where: {
              id: productId,
            },
            data: {
              quantity: {
                decrement: cart.cartDetails[i].quantity,
              },
              sold: {
                increment: cart.cartDetails[i].quantity,
              },
            },
          });
        }
      }
    });
    return "";
  } catch (error) {
    return error.message;
  }
};

const getOrderDetailByUserID = async (id: number) => {
  // Bước 1: Lấy tất cả các đơn hàng (order) của người dùng.
  const orders = await prisma.order.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true, // Chỉ lấy trường ID để tối ưu
    },
  });

  // Nếu người dùng không có đơn hàng nào, trả về mảng rỗng
  if (!orders || orders.length === 0) {
    return [];
  }

  // Bước 2: Trích xuất các ID từ kết quả trên thành một mảng số đơn giản.
  // Ví dụ: [10, 11, 15]
  const orderIds = orders.map((item) => item.id);

  // Bước 3: Tìm tất cả các chi tiết đơn hàng (orderDetail)
  // có 'orderId' nằm trong mảng 'orderIds'.
  const orderDetails = await prisma.orderDetail.findMany({
    where: {
      orderId: {
        in: orderIds, // Sử dụng toán tử 'in' của Prisma
      },
    },
    include: {
      product: true,
      order: true,
    },
  });
  log("orderDetails", orderDetails);
  return orderDetails;
};
export {
  getProducts,
  getProductByID,
  addProductToCart,
  getCartDetail,
  deleteProductInCart,
  updateCartDetailBeforeCheckOut,
  handlerPlaceOrder,
  getOrderDetailByUserID,
};
