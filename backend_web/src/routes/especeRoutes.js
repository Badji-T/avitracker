const express = require("express");
const router = express.Router();

const especeController = require("../controllers/especeController");

router.get("/", especeController.getEspeces);
router.get("/:id", especeController.getEspece);
router.post("/", especeController.createEspece);
router.put("/:id", especeController.updateEspece);
router.delete("/:id", especeController.deleteEspece);

module.exports = router;