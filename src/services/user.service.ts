import { Role } from "./../../node_modules/.prisma/client/index.d";
import { name } from "ejs";
import { Connection } from "./../../node_modules/mysql2/promise.d";
import { log } from "console";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";

import bcrypt from "bcrypt";
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, saltRounds);
};
const handleCreateUser = async (
  fullName: string,
  username: string,
  password: string,
  phone: string,
  role: string,
  address: string,
  avatar: string
) => {
  //insert to database

  const defaultPassword = await hashPassword(password);
  // Using placeholders
  const newUer = await prisma.user.create({
    data: {
      fullName: fullName,
      username: username,
      phone: phone,
      password: defaultPassword,
      address: address,
      accountType: ACCOUNT_TYPE.SYSTEM,
      avatar: avatar,
      roleId: +role,
    },
  });
  return newUer;
};

const getAllUsers = async () => {
  const allUer = await prisma.user.findMany();
  return allUer;
};

const getAllRole = async () => {
  const roles = await prisma.role.findMany();
  return roles;
};

const handelDeleteUser = async (id: string) => {
  const userDelete = await prisma.user.delete({
    where: {
      id: +id,
    },
  });
  log("Fetched user dl ID:", userDelete);
  return userDelete;
};

const getUserByID = async (id: string) => {
  const userByID = await prisma.user.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return userByID;
};
const updateUserByID = async (
  id: string,
  fullName: string,
  email: string,
  address: string
) => {
  const newUer = await prisma.user.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      fullName: fullName,
      username: email,
      address: address,
      password: "",
      accountType: "",
    },
  });
  return newUer;
};

export {
  handleCreateUser,
  getAllUsers,
  handelDeleteUser,
  getUserByID,
  updateUserByID,
  getAllRole,
  hashPassword,
};
