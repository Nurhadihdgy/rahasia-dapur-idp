class DashboardRepository {
  constructor({ User, Recipe, Tips }) {
    this.User = User;
    this.Recipe = Recipe;
    this.Tips = Tips;
  }

  countUsers() {
    return this.User.countDocuments();
  }

  countRecipes() {
    return this.Recipe.countDocuments();
  }

  countTips() {
    return this.Tips.countDocuments();
  }

  aggregateRecipesByCategory() {
    return this.Recipe.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  aggregateUserGrowth() {
    return this.User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  }

  aggregateRecipeGrowth() {
    return this.Recipe.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  }
}

module.exports = DashboardRepository;
