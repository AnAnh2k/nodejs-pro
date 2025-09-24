import { log } from "console";

const handelCreateUser = (fullname: string, email: string, address: string) => {
  //insert to database

  //return result
  console.log(
    `Service =>>> Fullname: ${fullname} - Email: ${email} - Address: ${address}`
  );
};
export { handelCreateUser };
