const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const { requireAuth } = require("../middleware/auth");
const { profileRules } = require("../validators/authValidators");

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, profileRules, updateProfile);

module.exports = router;
