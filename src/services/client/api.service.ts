import { Role } from "@prisma/client";
import { Secret } from "./../../../node_modules/@types/jsonwebtoken/index.d";
import { prisma } from "config/client";
import { Request, Response } from "express";
import { comparePassword } from "services/user.service";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ACCOUNT_TYPE } from "config/constant";

const handleGetAllUsersApi = async () => {
  const allUer = await prisma.user.findMany();
  return allUer;
};

const handleGetUserByIdsApi = async (id: number) => {
  const allUer = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return allUer;
};

const handleUpdateUserByIdsApi = async (
  id: number,
  fullName: string,
  address: string,
  phone: string
) => {
  const allUer = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      fullName,
      address,
      phone,
    },
  });
  return allUer;
};

const handleDeleteUserByIdsApi = async (id: number) => {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
};

const handleUserLogin = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: { role: true },
  });
  //check password
  if (!user) {
    throw new Error(`Username not found: ${username}`);
  }
  //compare password
  const isMatch = await comparePassword(password, (await user).password);
  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  //có user login => định nghĩa access token
  const payload = {
    id: user.id,
    username: user.username,
    roleId: user.roleId,
    role: user.role.name,
    accountType: user.accountType,
    avatar: user.avatar,
  };
  const secret = process.env.JWT_SECRET;
  const expiresIn: any = process.env.JWT_EXPIRES_IN;
  const access_token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });

  return access_token;
};

export {
  handleGetAllUsersApi,
  handleGetUserByIdsApi,
  handleUpdateUserByIdsApi,
  handleDeleteUserByIdsApi,
  handleUserLogin,
};
