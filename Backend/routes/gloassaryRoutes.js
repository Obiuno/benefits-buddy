import { Router } from "express";
import glossaryController from "../controllers/glossaryController.js";

const glossaryRouter = Router();

glossaryRouter.get("/", glossaryController.getAllGlossaryItems);

export default glossaryRouter;
