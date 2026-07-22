const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const userController = require("../controllers/userController");
const authController = require('../controllers/authController');


router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;