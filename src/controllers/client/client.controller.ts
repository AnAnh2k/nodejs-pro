import { log } from "console";
import e, { Request, Response } from "express";
import { get } from "http";
import {
  addProductToCart,
  deleteProductInCart,
  getCartDetail,
  getOrderDetailByUserID,
  getProductByID,
  handlerPlaceOrder,
  updateCartDetailBeforeCheckOut,
} from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductByID(+id);
  return res.render("client/product/detail", { product });
};

const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (user) {
    await addProductToCart(1, +id, user);
  } else {
    return res.redirect("/login");
  }

  // THAY ĐỔI TỪ: return res.redirect("/");
  // THÀNH:
  return res.redirect("back");
};

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }
  const cartDetailByUserIDs = await getCartDetail(user.id);

  const cartId = cartDetailByUserIDs.length ? cartDetailByUserIDs[0].cartId : 0;
  return res.render("client/product/cart", {
    cartDetailByUserIDs: cartDetailByUserIDs,
    cartId,
  });
};

const postDeleteCartDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }
  await deleteProductInCart(+id, user.id, user.sumCart);
  return res.redirect("/cart");
};

const getCheckOutPage = async (req: Request, res: Response) => {
  const user = req.user;
  const cartDetailByUserIDs = await getCartDetail(user.id);

  return res.render("client/product/checkout", { cartDetailByUserIDs, user });
};

const postHandleCartToCheckOut = async (req: Request, res: Response) => {
  const user = req.user;
  const { cartId } = req.body;
  if (!user) {
    return res.redirect("/login");
  }
  const currentCartDetail: { id: string; quantity: string }[] =
    req.body?.cartDetails ?? [];

  await updateCartDetailBeforeCheckOut(currentCartDetail, cartId);
  return res.redirect("/checkout");
};

const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }

  const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body;

  const message = await handlerPlaceOrder(
    user.id,
    receiverName,
    receiverAddress,
    receiverPhone,
    totalPrice
  );
  console.log("check message", message);
  if (message) {
    return res.redirect("/checkout");
  }
  return res.redirect("/thanks");
};

const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }

  return res.render("client/product/thanks");
};

const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }
  const orderDetails = await getOrderDetailByUserID(user.id);
  log("orderDetails controllers", orderDetails);
  return res.render("client/order/history", { orderDetails });
};

export {
  getProductPage,
  postAddProductToCart,
  getCartPage,
  postDeleteCartDetail,
  getCheckOutPage,
  postHandleCartToCheckOut,
  postPlaceOrder,
  getThanksPage,
  getOrderHistoryPage,
};
