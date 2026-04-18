import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import path, { join } from "node:path";

import { apiReference } from "@scalar/express-api-reference";

import faqsRouter from "./routes/faqRoutes.js";
import glossaryRouter from "./routes/gloassaryRoutes.js";
import benefitsRouter from "./routes/benefitsRoutes.js";

import aiRouter from "./routes/aiRoutes.js";

const app = express();

//setting up static sites for images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Benefits Buddy Operational!" });
});

//Uncomment when spec is up and running
//app.use("/reference", apiReference({ spec: { content: specs } }));

app.use("/static", express.static(path.join(__dirname, "assets/images")));
app.use(express.static(path.join(__dirname, "../Frontend")));

app.use("/api/faqs", faqsRouter);
app.use("/api/glossary", glossaryRouter);
app.use("/api/benefits", benefitsRouter);
app.use("/api/ai", aiRouter);

// localhost set routes so our frontend can work locally and it is what we will need for render deploy as well
/*
app.use("/Images", express.static(path.join(__dirname, "../Frontend/Images")));
app.use(
  "/scripts",
  express.static(path.join(__dirname, "../Frontend/scripts")),
);
app.use("/styles", express.static(path.join(__dirname, "../Frontend/styles")));

app.get((req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/main.html"));
});
*/
export default app;
