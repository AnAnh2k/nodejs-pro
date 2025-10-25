import { Request, Response } from "express";
import { addProductToCart } from "services/client/item.service";
import {
  handleGetAllUsersApi,
  handleGetUserByIdsApi,
} from "services/client/api.service";
import { log } from "console";

const postAddProductToCartAPI = async (req: Request, res: Response) => {
  const { quantity, productId } = req.body;
  const user = req.user;
  const currentSum = req?.user?.sumCart ?? 0;
  const newSum = currentSum + +quantity;

  await addProductToCart(+quantity, +productId, user);

  res.status(200).json({
    data: newSum,
  });
};

const getAllUsersAPI = async (req: Request, res: Response) => {
  const data = await handleGetAllUsersApi();
  res.status(200).json({
    data: data,
  });
};

const getUsersByIdAPI = async (req: Request, res: Response) => {
  const { id } = req.params;
  log("id: ", id);
  const data = await handleGetUserByIdsApi(+id);
  res.status(200).json({
    data: data,
  });
};

export { postAddProductToCartAPI, getAllUsersAPI, getUsersByIdAPI };
