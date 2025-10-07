import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import e from "express";
import { comparePassword, hashPassword } from "services/user.service";

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

const handleLogin = async (
  username: string,
  password: string,
  callback: any
) => {
  //check user exist
  const user = prisma.user.findUnique({
    where: { username: username },
  });
  //check password
  if (!user) {
    // throw new Error(`Username not found: ${username}`);
    return callback(null, false, {
      message: `Username not found: ${username}`,
    });
  }
  //compare password
  const isMatch = await comparePassword(password, (await user).password);
  if (!isMatch) {
    // throw new Error("Password is incorrect");
    return callback(null, false, {
      message: "Password is incorrect.",
    });
  }
  return callback(null, user);
};

export { isEmailExist, registerNewUser, handleLogin };
