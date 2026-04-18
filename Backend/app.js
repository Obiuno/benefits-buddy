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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/main.htm"));
});
//Uncomment when spec is up and running
//app.use("/reference", apiReference({ spec: { content: specs } }));

app.use("/static", express.static(path.join(__dirname, "assets/images")));
app.use(express.static(path.join(__dirname, "../Frontend")));

app.use("/api/faqs", faqsRouter);
app.use("/api/glossary", glossaryRouter);
app.use("/api/benefits", benefitsRouter);
app.use("/api/ai", aiRouter);

app.get((req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/main.html"));
});

export default app;
