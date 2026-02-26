class ActivityRepository {
  constructor(ActivityLog) {
    this.ActivityLog = ActivityLog;
  }

  getRecent(limit = 50) {
    return this.ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = ActivityRepository;
