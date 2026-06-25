const express = require("express");
const router = express.Router();
const {
  getVapidKey,
  subscribe,
  unsubscribe,
  getNotifications,
  markNotificationRead,
} = require("../controllers/notificationController");
const { requireAuth } = require("../middleware/auth");

router.get("/vapid-public-key", getVapidKey);
router.post("/subscribe", requireAuth, subscribe);
router.delete("/unsubscribe", requireAuth, unsubscribe);
router.get("/", requireAuth, getNotifications);
router.put("/:id/read", requireAuth, markNotificationRead);

module.exports = router;
