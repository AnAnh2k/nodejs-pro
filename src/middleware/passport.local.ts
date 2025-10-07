import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { handleLogin } from "services/client/auth.service";

const confidPassportLocal = () => {
  passport.use(
    new LocalStrategy(function verify(username, password, callback) {
      console.log("LocalStrategy called with:", { username, password });
      return handleLogin(username, password, callback);
    })
  );
};

export default confidPassportLocal;
