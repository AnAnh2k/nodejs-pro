import { prisma } from "config/client";
import { Request, Response } from "express";

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

export {
  handleGetAllUsersApi,
  handleGetUserByIdsApi,
  handleUpdateUserByIdsApi,
  handleDeleteUserByIdsApi,
};
