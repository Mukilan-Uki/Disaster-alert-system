const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { registerRules, loginRules } = require("../validators/authValidators");

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.get("/me", requireAuth, getMe);

module.exports = router;
