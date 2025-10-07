import { log } from "console";
import e, { Request, Response } from "express";
import { registerNewUser } from "services/client/auth.service";
import {
  RegisterSchema,
  TRegisterSchema,
} from "src/validation/register.schema";

const getRegisterPage = async (req: Request, res: Response) => {
  const oldData = {
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  };
  const errors = [];

  return res.render("client/auth/register", { oldData, errors });
};

const getLoginPage = async (req: Request, res: Response) => {
  const { session } = req as any;
  const messages = session?.messages ?? [];
  log("Login messages:", messages);
  return res.render("client/auth/login", { messages: messages });
};

const postRegisterPage = async (req: Request, res: Response) => {
  const { fullName, username, password, confirmPassword } =
    req.body as TRegisterSchema;
  const validate = await RegisterSchema.safeParseAsync(req.body);
  if (!validate.success) {
    //error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message} (${item.path[0]})`
    );

    const oldData = {
      fullName,
      username,
      password,
      confirmPassword,
    };

    return res.render("client/auth/register.ejs", {
      errors,
      oldData,
    });
  }
  //success
  await registerNewUser(fullName, username, password);

  return res.redirect("/login");
};

export { getRegisterPage, getLoginPage, postRegisterPage };
