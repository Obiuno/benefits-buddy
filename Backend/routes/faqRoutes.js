import { Router } from "express";
import { apiReference } from "@scalar/express-api-reference";
import { specs } from "../../config/swagger.js";
import faqsController from "../controllers/faqsController.js";

const faqsRouter = Router();

faqsRouter.get("/", faqsController.getAllFaqs);

export default faqsRouter;
