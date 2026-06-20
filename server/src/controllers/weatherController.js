const openWeatherService = require('../services/openWeatherService');

exports.getWeather = async (req, res, next) => {
  try {
    const city = req.query.city || process.env.DEFAULT_CITY || 'Colombo';
    const data = await openWeatherService.fetchWeatherByCity(city);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
