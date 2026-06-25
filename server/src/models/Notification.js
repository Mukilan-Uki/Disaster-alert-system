const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    alertId: { type: mongoose.Schema.Types.ObjectId, ref: "Alert" },
    alertType: { type: String, trim: true },
    channel: {
      type: String,
      enum: ["web_push", "email", "sms", "in_app"],
      default: "in_app",
    },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "sent",
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    readAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, alertType: 1, sentAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
