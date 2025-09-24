import getConnection from "../config/database";
import { Connection } from "./../../node_modules/mysql2/promise.d";
import { log } from "console";

const handelCreateUser = (fullname: string, email: string, address: string) => {
  //insert to database

  //return result
  console.log(
    `Service =>>> Fullname: ${fullname} - Email: ${email} - Address: ${address}`
  );
};

const getAllUsers = async () => {
  //get all users from database
  const connection = await getConnection();

  // A simple SELECT query
  try {
    const [results, fields] = await connection.query("SELECT * FROM `users`");
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};
export { handelCreateUser, getAllUsers };
