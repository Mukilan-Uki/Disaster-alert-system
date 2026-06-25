const openWeatherService = require("../services/openWeatherService");
const { evaluateRisk } = require("../services/riskEngine");
const City = require("../models/City");

async function enrichWithCityData(data, cityName) {
  const cityDoc = await City.findOne({
    name: new RegExp(
      `^${(cityName || data.city || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      "i"
    ),
  });

  if (cityDoc) {
    data.riskType = cityDoc.riskType;
    data.dbSeverity = cityDoc.severity;
    data.population = cityDoc.population;
  }

  return data;
}

exports.getWeather = async (req, res, next) => {
  try {
    const city = req.query.city || process.env.DEFAULT_CITY || "Colombo";
    const data = await openWeatherService.fetchWeatherByCity(city);
    await enrichWithCityData(data, city);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getWeatherByCoords = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: "Valid lat and lng are required" });
    }

    const data = await openWeatherService.fetchWeatherByCoords(lat, lng);
    await enrichWithCityData(data, data.city);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getWeatherRisk = async (req, res, next) => {
  try {
    let data;

    if (req.query.lat && req.query.lng) {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return res.status(400).json({ error: "Valid lat and lng are required" });
      }
      data = await openWeatherService.fetchWeatherByCoords(lat, lng);
    } else {
      const city = req.query.city || process.env.DEFAULT_CITY || "Colombo";
      data = await openWeatherService.fetchWeatherByCity(city);
    }

    await enrichWithCityData(data, data.city);

    const preferences = req.user?.alertPreferences || {};
    const risk = evaluateRisk(data, preferences);

    res.json({
      ...data,
      riskLevel: risk.overallLevel,
      risks: risk.risks,
    });
  } catch (err) {
    next(err);
  }
};
