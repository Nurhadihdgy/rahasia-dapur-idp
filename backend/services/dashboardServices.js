const ChartFormatter = require("../utils/chartFormatter");

class DashboardService {
  constructor(dashboardRepository, activityRepository) {
    this.dashboardRepository = dashboardRepository;
    this.activityRepository = activityRepository;
  }

  async getDashboardStats() {
    const [
      totalUsers,
      totalRecipes,
      totalTips,
      recipesByCategoryRaw,
      userGrowthRaw,
      recipeGrowthRaw,
      recentActivity,
    ] = await Promise.all([
      this.dashboardRepository.countUsers(),
      this.dashboardRepository.countRecipes(),
      this.dashboardRepository.countTips(),
      this.dashboardRepository.aggregateRecipesByCategory(),
      this.dashboardRepository.aggregateUserGrowth(),
      this.dashboardRepository.aggregateRecipeGrowth(),
      this.activityRepository.getRecent(20),
    ]);

    // Format Chart Data
    const recipesByCategory =
      ChartFormatter.formatCategoryChart(
        recipesByCategoryRaw,
        "Recipes per Category"
      );

    const userGrowth =
      ChartFormatter.formatMonthlyGrowth(
        userGrowthRaw,
        "User Growth"
      );

    const recipeGrowth =
      ChartFormatter.formatMonthlyGrowth(
        recipeGrowthRaw,
        "Recipe Growth"
      );

    return {
      totals: {
        totalUsers,
        totalRecipes,
        totalTips,
      },
      charts: {
        recipesByCategory,
        userGrowth,
        recipeGrowth,
      },
      recentActivity,
    };
  }
}

module.exports = DashboardService;
