const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["USER", "RECIPE", "TIPS"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
