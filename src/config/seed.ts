import { prisma } from "config/client";
import e from "express";
import { hashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "config/constant";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRole = await prisma.role.count();

  if (countUser === 0) {
    //seed data

    const defaultPassword = await hashPassword("123456");

    await prisma.user.createMany({
      data: [
        {
          fullName: "An Duc Anh",
          username: "anducanh@gmail.com",
          password: defaultPassword,
          accountType: ACCOUNT_TYPE.SYSTEM,
        },
        {
          fullName: "Admin",

          username: "admin@gmail.com",
          password: defaultPassword,
          accountType: ACCOUNT_TYPE.SYSTEM,
        },
      ],
    });
  } else if (countRole === 0) {
    //seed data
    await prisma.role.createMany({
      data: [
        {
          name: "ADMIN",
          description: "Admin thì full quền ",
        },
        {
          name: "USER",
          description: "User thông thường",
        },
      ],
    });
  } else {
    console.log("Database already seeded");
  }
};
export default initDatabase;
