const openWeatherService = require("../services/openWeatherService");
const City = require("../models/City");

exports.getWeather = async (req, res, next) => {
  try {
    const city = req.query.city || process.env.DEFAULT_CITY || "Colombo";
    const data = await openWeatherService.fetchWeatherByCity(city);

    const cityDoc = await City.findOne({
      name: new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    });

    if (cityDoc) {
      data.riskType = cityDoc.riskType;
      data.severity = cityDoc.severity;
      data.population = cityDoc.population;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};
