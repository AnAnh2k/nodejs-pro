import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import e from "express";
import { hashPassword } from "services/user.service";

const isEmailExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { username: email },
  });

  if (user) {
    return true;
  }
  return false;
};

const registerNewUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const newPassword = await hashPassword(password);
  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });
  if (userRole) {
    await prisma.user.create({
      data: {
        fullName: fullName,
        username: email,
        password: newPassword,
        roleId: userRole.id, // default role is user
        accountType: ACCOUNT_TYPE.SYSTEM,
        avatar: "default-avatar.png",
      },
    });
  } else {
    {
      throw new Error("Role USER not found");
    }
  }
};

export { isEmailExist, registerNewUser };
