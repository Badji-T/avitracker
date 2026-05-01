const express = require("express");
const router = express.Router();

const depenseController = require("../controllers/depenseController");

router.get("/", depenseController.getDepenses);
router.get("/:id", depenseController.getDepense);
router.post("/", depenseController.createDepense);
router.put("/:id", depenseController.updateDepense);
router.delete("/:id", depenseController.deleteDepense);

module.exports = router;