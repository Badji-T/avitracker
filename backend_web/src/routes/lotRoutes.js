const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const lotController = require("../controllers/lotController");

// Liste des lots
router.get("/", verifyToken, lotController.getLots);

// Détails d'un lot
router.get("/:id", verifyToken, lotController.getLot);

// Créer un lot
router.post("/", verifyToken, lotController.createLot);

// Modifier un lot
router.put("/:id", verifyToken, lotController.updateLot);

// Supprimer un lot
router.delete("/:id", verifyToken, lotController.deleteLot);

// Résumé d'un lot
router.get("/:id/summary", verifyToken, lotController.getLotSummary);

module.exports = router;