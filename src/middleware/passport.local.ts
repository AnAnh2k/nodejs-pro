import { prisma } from "config/client";
import { log } from "console";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePassword } from "services/user.service";

const confidPassportLocal = () => {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, async function verify(
      username,
      password,
      callback
    ) {
      console.log("LocalStrategy called with:", { username, password });
      //check user exist
      const user = await prisma.user.findUnique({
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
      log("Authentication successful for user:", user.username);
      return callback(null, user);
    })
  );

  passport.serializeUser(function (user: any, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};

export default confidPassportLocal;
