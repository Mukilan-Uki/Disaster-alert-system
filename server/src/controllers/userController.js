const { validationResult } = require("express-validator");

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    alertPreferences: user.alertPreferences,
    notificationChannels: user.notificationChannels,
    lastKnownLocation: user.lastKnownLocation,
    hasPushSubscription: !!user.pushSubscription?.endpoint,
    createdAt: user.createdAt,
  };
}

exports.getProfile = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, alertPreferences, notificationChannels } = req.body;

    if (name) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    if (alertPreferences) {
      Object.assign(req.user.alertPreferences, alertPreferences);
      req.user.markModified("alertPreferences");
    }
    if (notificationChannels) {
      Object.assign(req.user.notificationChannels, notificationChannels);
      req.user.markModified("notificationChannels");
    }

    await req.user.save();
    res.json({ user: formatUser(req.user) });
  } catch (err) {
    next(err);
  }
};

exports.formatUser = formatUser;
