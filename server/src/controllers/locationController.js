const { validationResult } = require("express-validator");

exports.updateLocation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lat, lng, city, district, accuracy } = req.body;
    const user = req.user;

    user.lastKnownLocation = {
      lat,
      lng,
      city: city || user.lastKnownLocation?.city,
      district: district || user.lastKnownLocation?.district,
      accuracy,
      updatedAt: new Date(),
    };

    await user.save();

    res.json({
      message: "Location updated",
      location: user.lastKnownLocation,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentLocation = async (req, res) => {
  res.json({ location: req.user.lastKnownLocation || null });
};
