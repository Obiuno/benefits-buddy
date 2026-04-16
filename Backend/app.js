import express from "express";
import cors from "cors";

import { apiReference } from "@scalar/express-api-reference";

import faqsRouter from "./routes/faqRoutes.js";
import glossaryRouter from "./routes/gloassaryRoutes.js";
import benefitsRouter from "./routes/benefitsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Benefits Buddy Operational!" });
});

//Uncomment when spec is up and running
//app.use("/reference", apiReference({ spec: { content: specs } }));

app.use("/api/faqs", faqsRouter);
app.use("/api/glossary", glossaryRouter);
app.use("/api/benefits", benefitsRouter);

export default app;
