const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/isAuth");
const uploadImg = require("../middleware/uploadImg");
const authRoutes = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Se debe de ingresar un email válido")
      .normalizeEmail(),
    body("password", "Se debe de ingresar una contraseña válida")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(
            "La contraseña no coincide con la contraseña ingresada"
          );
        }
        return true;
      }),
  ],
  uploadImg.single("img"),
  authRoutes.register
);

router.post("/login", authRoutes.login);

router.get("/account", isAuth, authRoutes.getAccount);

router.put(
  "/account",
  isAuth,
  [
    body("email")
      .isEmail()
      .withMessage("Se debe de ingresar un email válido")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim()
      .withMessage("Se debe de ingresar una contraseña válida")
  ],
  uploadImg.single("img"),
  authRoutes.editAccount
);

router.post("/account/delete", isAuth, authRoutes.deleteUser);

module.exports = router;
