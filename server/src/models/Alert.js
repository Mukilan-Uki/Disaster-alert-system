const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    affectedCities: [{ type: String, trim: true }],
    severity: { type: String, trim: true },
  },
  {
    collection: "alert",
    versionKey: false,
  }
);

module.exports = mongoose.model("Alert", alertSchema);
