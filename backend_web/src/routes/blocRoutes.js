const express = require("express");
const router = express.Router();

const blocController = require("../controllers/blocController");

// Routes CRUD
router.get("/", blocController.getBlocs);
router.get("/:id", blocController.getBloc);
router.post("/", blocController.createBloc);
router.put("/:id", blocController.updateBloc);
router.delete("/:id", blocController.deleteBloc);

module.exports = router;