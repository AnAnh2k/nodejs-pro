import { prisma } from "config/client";
import e from "express";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
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
  } else {
    console.log("Database already seeded");
  }
};
export default initDatabase;
