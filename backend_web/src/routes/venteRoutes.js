const express = require("express");
const router = express.Router();
const venteController = require("../controllers/venteController");


//Routes ventes
router.get("/", venteController.getVentes);
router.get("/:id", venteController.getVente);
router.post("/", venteController.createVente);
router.put("/:id", venteController.updateVente);
router.delete("/:id", venteController.deleteVente);


module.exports = router;