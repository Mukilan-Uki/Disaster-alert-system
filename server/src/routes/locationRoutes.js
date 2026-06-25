const express = require("express");
const router = express.Router();
const {
  updateLocation,
  getCurrentLocation,
} = require("../controllers/locationController");
const { requireAuth } = require("../middleware/auth");
const { locationRules } = require("../validators/authValidators");

router.post("/update", requireAuth, locationRules, updateLocation);
router.get("/current", requireAuth, getCurrentLocation);

module.exports = router;
