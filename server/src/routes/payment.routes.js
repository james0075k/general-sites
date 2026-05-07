const express = require("express");
const router = express.Router();
const {
  initKhalti, verifyKhalti, initEsewa, verifyEsewa,
} = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/khalti/init", protect, initKhalti);
router.post("/khalti/verify", protect, verifyKhalti);
router.post("/esewa/init", protect, initEsewa);
router.get("/esewa/verify", verifyEsewa);

module.exports = router;
