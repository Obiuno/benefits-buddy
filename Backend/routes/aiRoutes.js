import { Router } from "express";
import aiController from "../controllers/aiController.js";

const aiRouter = Router();

aiRouter.post("/chat", aiController.aiChat);

export default aiRouter;
