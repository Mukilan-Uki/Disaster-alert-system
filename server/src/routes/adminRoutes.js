const express = require("express");
const router = express.Router();
const {
  triggerMonitor,
  getStats,
  createOfficialAlert,
} = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.use(requireAuth, requireAdmin);

router.get("/stats", getStats);
router.post("/alerts", createOfficialAlert);
router.post("/monitor/run", triggerMonitor);

module.exports = router;
