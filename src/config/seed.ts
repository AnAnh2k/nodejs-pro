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
    const adminRole = await prisma.role.findFirst({
      where: { name: "ADMIN" },
    });
    if (adminRole)
      await prisma.user.createMany({
        data: [
          {
            fullName: "An Duc Anh",
            username: "anducanh@gmail.com",
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: adminRole.id,
            avatar: "avatar-default.png",
          },
          {
            fullName: "User",
            username: "user@gmail.com",
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: adminRole.id,
            avatar: "avatar-default.png",
          },
        ],
      });
  }
  if (countRole === 0) {
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
  }
  if (countUser !== 0 && countRole !== 0) {
    console.log("Database already seeded");
  }
};
export default initDatabase;
