import express from "express";
import cors from "cors";
import faqsRouter from "./routes/faqRoutes.js";
import glossaryRouter from "./routes/gloassaryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Benefits Buddy Operational!" });
});

app.use("/api/faqs", faqsRouter);
app.use("/api/glossary", glossaryRouter);

export default app;
