import { prisma } from "config/client";
import e from "express";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRole = await prisma.role.count();

  if (countUser === 0) {
    //seed data
    await prisma.user.createMany({
      data: [
        {
          username: "anducanh@gmail.com",
          password: "123456",
          accountType: "SYSTEM",
        },
        {
          username: "admin@gmail.com",
          password: "123456",
          accountType: "SYSTEM",
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
