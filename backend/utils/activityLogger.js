const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({
  userId,
  action,
  type,
  referenceId,
  description,
}) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      type,
      referenceId,
      description,
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};

module.exports = logActivity;
