import db from "../database/connection.js";

const createUser = async (username, password) => {
  const result = await db.query(
    `INSERT INTO users (username, password)
     VALUES ($1, $2)
     RETURNING id, username`,
    [username, password]
  );

  return result.rows[0];
};

const loginUser = async (username, password) => {
  const result = await db.query(
    `SELECT id, username
     FROM users
     WHERE username=$1 AND password=$2`,
    [username, password]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid login");
  }

  return result.rows[0];
};

export default { createUser, loginUser };