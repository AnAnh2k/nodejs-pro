import { Role } from "@prisma/client";
import { Secret } from "./../../../node_modules/@types/jsonwebtoken/index.d";
import { prisma } from "config/client";
import { Request, Response } from "express";
import { comparePassword } from "services/user.service";
import jwt from "jsonwebtoken";
import "dotenv/config";

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
    email: user.username,
    roleId: user.roleId,
  };
  const secret = process.env.JWT_SECRET;
  const access_token = jwt.sign(payload, secret, {
    expiresIn: "1d",
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
