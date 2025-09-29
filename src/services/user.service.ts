import { name } from "ejs";
import getConnection from "config/database";
import { Connection } from "./../../node_modules/mysql2/promise.d";
import { log } from "console";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "config/client";

const handleCreateUser = async (
  fullname: string,
  email: string,
  address: string
) => {
  //insert to database

  // Using placeholders
  const newUer = await prisma.user.create({
    data: {
      fullName: fullname,
      username: email,
      address: address,
      password: "",
      accountType: "",
    },
  });
  return newUer;
};

const getAllUsers = async () => {
  const allUer = await prisma.user.findMany();
  return allUer;
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
  log("Fetched user by ID:", userByID);
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
};
