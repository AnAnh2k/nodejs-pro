import { Role } from "./../../node_modules/.prisma/client/index.d";
import { name } from "ejs";
import { Connection } from "./../../node_modules/mysql2/promise.d";
import { log } from "console";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "config/client";
import { ACCOUNT_TYPE, TOTAL_ITEMs_PER_PAGE } from "config/constant";

import bcrypt from "bcrypt";
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, saltRounds);
};

const comparePassword = async (plainText: string, hash: string) => {
  return await bcrypt.compare(plainText, hash);
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

const getAllUsers = async (page: number) => {
  const pageSize = TOTAL_ITEMs_PER_PAGE;
  const skip = (page - 1) * pageSize;
  const allUer = await prisma.user.findMany({
    skip: skip,
    take: pageSize,
  });
  return allUer;
};

const countToTalUserPages = async () => {
  const pageSize = TOTAL_ITEMs_PER_PAGE;

  const totalItems = await prisma.user.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  return totalPages;
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

const getUserByID = async (id: number) => {
  const userByID = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return userByID;
};

const getUserByIDClient = async (id: number) => {
  const userByID = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return userByID;
};
const updateUserByID = async (
  id: string,
  fullName: string,

  phone: string,
  role: string,
  address: string,
  avatar: string
) => {
  // const defaultPassword = await hashPassword(password ?? "123456");

  const newUer = await prisma.user.update({
    where: {
      id: +id,
    },
    data: {
      fullName: fullName,
      // username: username,
      phone: phone,
      // password: defaultPassword,
      address: address,
      accountType: ACCOUNT_TYPE.SYSTEM,

      roleId: +role,
      ...(avatar !== undefined && { avatar: avatar }),
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
  comparePassword,
  getUserByIDClient,
  countToTalUserPages,
};
