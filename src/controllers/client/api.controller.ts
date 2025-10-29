import { Request, Response } from "express";
import { addProductToCart } from "services/client/item.service";
import {
  handleDeleteUserByIdsApi,
  handleGetAllUsersApi,
  handleGetUserByIdsApi,
  handleUpdateUserByIdsApi,
  handleUserLogin,
} from "services/client/api.service";
import { log } from "console";
import {
  RegisterSchema,
  TRegisterSchema,
} from "src/validation/register.schema";
import { registerNewUser } from "services/client/auth.service";

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

const createUserAPI = async (req: Request, res: Response) => {
  const { fullName, username, password, confirmPassword } =
    req.body as TRegisterSchema;
  const validate = await RegisterSchema.safeParseAsync(req.body);
  if (!validate.success) {
    //error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message} (${item.path[0]})`
    );

    res.status(400).json({
      errors: errors,
    });
    return;
  }
  //success
  await registerNewUser(fullName, username, password);

  res.status(201).json({
    data: "create user success",
  });
  return;
};

const updateUserById = async (req: Request, res: Response) => {
  const { fullName, address, phone } = req.body;
  const { id } = req.params;

  //success
  await handleUpdateUserByIdsApi(+id, fullName, address, phone);

  res.status(200).json({
    data: "update user success",
  });
  return;
};

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  //success
  await handleDeleteUserByIdsApi(+id);

  res.status(200).json({
    data: "delete user success",
  });
  return;
};

const loginAPI = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const access_token = await handleUserLogin(username, password);
    res.status(200).json({
      data: {
        access_token,
      },
    });
  } catch (error) {
    log(error);
    res.status(401).json({
      data: null,
      message: error.message,
    });
  }
};

export {
  postAddProductToCartAPI,
  getAllUsersAPI,
  getUsersByIdAPI,
  createUserAPI,
  updateUserById,
  deleteUserById,
  loginAPI,
};
