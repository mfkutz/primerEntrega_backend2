import { Router } from "express";
import {
  login,
  register,
  logout,
  loginError,
  current,
} from "../dao/db/sessionDBManager.js";
import { passportCall } from "../middlewares/passport.middleware.js";

const router = Router();

router.post("/login", passportCall("login"), login);
router.get("/current", passportCall("jwt"), current);
router.post("/register", passportCall("register"), register);
router.get("/logout", logout);
router.get("/login-error", loginError);

export default router;
