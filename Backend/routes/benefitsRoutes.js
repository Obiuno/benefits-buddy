import { Router } from "express";
import benefitsController from "../controllers/benefitsController.js";

const benefitsRouter = Router();

benefitsRouter.get("/", benefitsController.getAllBenefits);

export default benefitsRouter;
