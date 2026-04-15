import { Router } from "express";
import faqsController from "../controllers/faqsController.js";

const faqsRouter = Router();

faqsRouter.get("/", faqsController.getAllFaqs);

export default faqsRouter;
