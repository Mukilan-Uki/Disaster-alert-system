const express = require("express");
const router = express.Router();
const {
  getWeather,
  getWeatherByCoords,
  getWeatherRisk,
} = require("../controllers/weatherController");
const { optionalAuth } = require("../middleware/auth");

router.get("/coords", getWeatherByCoords);
router.get("/risk", optionalAuth, getWeatherRisk);
router.get("/", getWeather);

module.exports = router;
