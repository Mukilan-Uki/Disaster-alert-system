const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true, trim: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    riskType: { type: String, trim: true },
    severity: { type: String, trim: true },
    population: { type: String, trim: true },
  },
  {
    collection: "cities",
    versionKey: false,
  }
);

module.exports = mongoose.model("City", citySchema);
