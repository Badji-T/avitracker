const express = require("express");
const router = express.Router();

const perteController = require("../controllers/perteController");

router.get("/", perteController.getPertes);
router.get("/:id", perteController.getPerte);
router.post("/", perteController.createPerte);
router.put("/:id", perteController.updatePerte);
router.delete("/:id", perteController.deletePerte);

module.exports = router;