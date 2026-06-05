const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get(
  "/admin-access",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({ message: "Accès admin autorisé." });
  }
);

module.exports = router;