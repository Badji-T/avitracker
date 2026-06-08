const express = require("express");
const router = express.Router();

const syncController = require("../controllers/syncController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/upload", authMiddleware, syncController.upload);
router.get("/download", authMiddleware, syncController.download);

module.exports = router;