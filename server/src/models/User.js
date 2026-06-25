const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    alertPreferences: {
      flood: { type: Boolean, default: true },
      cyclone: { type: Boolean, default: true },
      heavyRain: { type: Boolean, default: true },
      heat: { type: Boolean, default: true },
      landslide: { type: Boolean, default: true },
    },
    notificationChannels: {
      webPush: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    pushSubscription: {
      endpoint: String,
      keys: {
        p256dh: String,
        auth: String,
      },
    },
    lastKnownLocation: {
      lat: Number,
      lng: Number,
      city: String,
      district: String,
      accuracy: Number,
      updatedAt: Date,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

module.exports = mongoose.model("User", userSchema);
