// #imports and exports with ES modules

import path from "path";
import fs from "fs";

export const renderDOM = async (filename) => {
  const filePath = path.join(process.cwd(), filename);
  const html = fs.readFileSync(filePath, "utf-8");

  document.body.innerHTML = html;

  return document;
};
