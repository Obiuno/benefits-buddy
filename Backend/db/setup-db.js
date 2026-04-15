import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "./connect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sql = readFileSync(__dirname + "/setup.sql").toString();

db.query(sql)
  .then(() => console.log("Setup complete"))
  .catch((error) => console.log(error));
