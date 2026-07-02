import { Router } from "express";
import { loginController } from "../controllers/authController.js";
import { verifyCaptcha } from "../middleware/verifyCaptcha.js";

const router = Router();

router.post("/login", verifyCaptcha, loginController);

export default router;
