import express from "express";
import cors from "cors";
import faqsRouter from "./routes/faqRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/faqs", faqsRouter);

export default app;
