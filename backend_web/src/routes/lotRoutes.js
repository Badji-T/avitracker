const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const lotController = require("../controllers/lotController");

router.get("/", lotController.getLots);
router.get("/:id", lotController.getLot);
router.post("/", lotController.createLot);
router.put("/:id", lotController.updateLot);
router.delete("/:id", lotController.deleteLot);

router.get(
    "/:id/summary",
    //verifyToken,
    lotController.getLotSummary
);

module.exports = router;