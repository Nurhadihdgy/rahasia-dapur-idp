class RecipeRepository {
  constructor(RecipeModel) {
    this.Recipe = RecipeModel;
  }

  async findAll(query, page, limit) {
    const recipes = await this.Recipe.find(query)
      .populate("createdBy", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.Recipe.countDocuments(query);

    return { recipes, total };
  }
  async findOne(query) {
    return await this.Recipe.findOne(query);
  }

  async findViews(id) {
    const recipe = await this.Recipe.findById(id);
    if (!recipe) return null;
    return { views: recipe.views };
  }

  async findById(id) {
    return this.Recipe.findById(id).populate("createdBy", "name");
  }

  async create(data) {
    return this.Recipe.create(data);
  }

  async save(entity) {
    return entity.save();
  }

  async delete(id) {
    return this.Recipe.findByIdAndDelete(id);
  }
}

module.exports = RecipeRepository;
