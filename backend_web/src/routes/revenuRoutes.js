const express = require("express");
const router = express.Router();

const revenuController = require("../controllers/revenuController");

router.get("/", revenuController.getRevenus);
router.get("/:id", revenuController.getRevenu);
router.post("/", revenuController.createRevenu);
router.put("/:id", revenuController.updateRevenu);
router.delete("/:id", revenuController.deleteRevenu);

module.exports = router;