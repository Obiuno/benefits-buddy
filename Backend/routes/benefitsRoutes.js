import { Router } from "express";
import benefitsController from "../controllers/benefitsController.js";

const benefitsRouter = Router();

benefitsRouter.get("/frontend", benefitsController.getBenefitsForFrontend);
benefitsRouter.get("/", benefitsController.getAllBenefits);

export default benefitsRouter;
