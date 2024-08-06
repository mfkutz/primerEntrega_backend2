import { Router } from "express";
import { passportCall } from "../middlewares/passport.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Inicio" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

router.get("/profile", passportCall("jwt"), (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  res.render("profile", { title: "Perfil", user: req.user });
});

export default router;
