import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import path, { join } from "node:path";

import { apiReference } from "@scalar/express-api-reference";

import faqsRouter from "./routes/faqRoutes.js";
import glossaryRouter from "./routes/gloassaryRoutes.js";
import benefitsRouter from "./routes/benefitsRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

//setting up static sites for images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// normal middleware
app.use(cors());
app.use(express.json());

// static files
app.use("/static", express.static(path.join(__dirname, "assets/images")));
app.use(express.static(path.join(__dirname, "../Frontend")));

/*
app.get("/", (req, res) => {
  res.status(200).json({ message: "Benefits Buddy Operational!" });
});
*/

// E.T. route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/main.html"));
});
//Uncomment when spec is up and running
//app.use("/reference", apiReference({ spec: { content: specs } }));

// API routes
app.use("/api/faqs", faqsRouter);
app.use("/api/glossary", glossaryRouter);
app.use("/api/benefits", benefitsRouter);
app.use("/api/ai", aiRouter);

// error handler
// last as everything should go right. Right?
// did 500 as I think it's my fault for something we haven't handled or covered
app.use(errorHandler);

// E.T. reroute
app.get((req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/main.html"));
});

export default app;
