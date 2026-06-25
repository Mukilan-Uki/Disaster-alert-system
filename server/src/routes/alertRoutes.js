const express = require("express");
const router = express.Router();
const {
  getActiveAlerts,
  getAlertHistory,
  markAlertRead,
  checkMyWeather,
} = require("../controllers/alertController");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, getActiveAlerts);
router.get("/history", requireAuth, getAlertHistory);
router.post("/check", requireAuth, checkMyWeather);
router.put("/:id/read", requireAuth, markAlertRead);

module.exports = router;
