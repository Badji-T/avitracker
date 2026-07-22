const express = require("express");
const router = express.Router();

const especeController = require("../controllers/especeController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", verifyToken, especeController.getEspeces);
router.get("/:id", verifyToken, especeController.getEspece);
router.post("/", verifyToken, especeController.createEspece);
router.put("/:id", verifyToken, especeController.updateEspece);
router.delete("/:id", verifyToken, especeController.deleteEspece);

module.exports = router;