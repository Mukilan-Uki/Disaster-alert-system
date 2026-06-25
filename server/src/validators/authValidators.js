const { body } = require("express-validator");

exports.registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").optional().trim(),
  body("location.lat").optional().isFloat({ min: -90, max: 90 }),
  body("location.lng").optional().isFloat({ min: -180, max: 180 }),
];

exports.loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.profileRules = [
  body("name").optional().trim().notEmpty(),
  body("phone").optional().trim(),
  body("alertPreferences").optional().isObject(),
  body("notificationChannels").optional().isObject(),
];

exports.locationRules = [
  body("lat").isFloat({ min: -90, max: 90 }).withMessage("Valid lat required"),
  body("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid lng required"),
  body("city").optional().trim(),
  body("district").optional().trim(),
  body("accuracy").optional().isFloat({ min: 0 }),
];
