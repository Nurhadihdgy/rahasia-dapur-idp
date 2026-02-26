const asyncHandler = require("../utils/asyncHandler");

const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Tips = require("../models/Tips");
const ActivityLog = require("../models/ActivityLog");
const ApiResponse = require("../utils/response");

const DashboardRepository = require("../repository/dashboardRepository");
const ActivityRepository = require("../repository/activityRepository");
const DashboardService = require("../services/dashboardServices");

class DashboardController {
  constructor() {
    const dashboardRepository = new DashboardRepository({
      User,
      Recipe,
      Tips,
    });

    const activityRepository = new ActivityRepository(ActivityLog);

    this.dashboardService = new DashboardService(
      dashboardRepository,
      activityRepository
    );
  }

  getDashboardStats = asyncHandler(async (req, res) => {
    const data = await this.dashboardService.getDashboardStats();

    return ApiResponse.success(res, data, "Dashboard stats retrieved successfully", 200);
  });
}

module.exports = new DashboardController();
