import { name } from "ejs";
import getConnection from "../config/database";
import { Connection } from "./../../node_modules/mysql2/promise.d";
import { log } from "console";

const handelCreateUser = async (
  fullname: string,
  email: string,
  address: string
) => {
  //insert to database
  const connection = await getConnection();
  // Using placeholders
  try {
    const sql =
      "INSERT INTO `users`(`name`, `email`,`address`) VALUES (?, ?, ?)";
    const values = [fullname, email, address];

    const [result, fields] = await connection.execute(sql, values);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
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
