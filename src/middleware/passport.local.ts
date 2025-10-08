import { prisma } from "config/client";
import { log } from "console";
import { get } from "http";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserWithRoleByID } from "services/client/auth.service";
import { comparePassword, getUserByID } from "services/user.service";

const confidPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        //  usernameField: "username"
        passReqToCallback: true,
      },
      async function verify(req, username, password, callback) {
        const { session } = req as any;
        if (session?.messages?.length) {
          session.messages = [];
        }
        const messages = session?.messages ?? [];
        console.log("LocalStrategy called with:", { username, password });
        //check user exist
        const user = await prisma.user.findUnique({
          where: { username: username },
        });
        //check password
        if (!user) {
          // throw new Error(`Username not found: ${username}`);
          return callback(null, false, {
            message: `Username/password is incorrect.`,
          });
        }
        //compare password
        const isMatch = await comparePassword(password, (await user).password);
        if (!isMatch) {
          // throw new Error("Password is incorrect");
          return callback(null, false, {
            message: "Username/password is incorrect.",
          });
        }
        return callback(null, user as any);
      }
    )
  );

  passport.serializeUser(function (user: any, callback) {
    callback(null, { id: user.id, username: user.username });
  });

  passport.deserializeUser(async function (user: any, callback) {
    const { id, usename } = user;
    //query user by id
    const userInDB = await getUserWithRoleByID(id);
    return callback(null, { ...userInDB });
  });
};

export default confidPassportLocal;
