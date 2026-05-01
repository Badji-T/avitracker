const express = require("express");
const router = express.Router();

const lotController = require("../controllers/lotController");

router.get("/", lotController.getLots);
router.get("/:id", lotController.getLot);
router.post("/", lotController.createLot);
router.put("/:id", lotController.updateLot);
router.delete("/:id", lotController.deleteLot);

module.exports = router;