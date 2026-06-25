const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ["safe", "warning", "danger"],
      default: "warning",
    },
    affectedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    affectedCities: [{ type: String, trim: true }],
    weatherSnapshot: { type: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    readBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: { type: Date },
  },
  {
    collection: "alert",
    timestamps: true,
  }
);

alertSchema.index({ affectedUsers: 1, status: 1, createdAt: -1 });
alertSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model("Alert", alertSchema);
