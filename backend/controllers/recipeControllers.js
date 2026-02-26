const Recipe = require("../models/Recipe");
const RecipeRepository = require("../repository/recipeRepository");
const RecipeService = require("../services/recipeServices");
const RecipeDTO = require("../dto/recipeDto");
const ApiResponse = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/appError");
const repository = new RecipeRepository(Recipe);
const service = new RecipeService(repository);

class RecipeController {

  getAll = asyncHandler(async (req, res) => {
    const data = await service.getRecipes(req.query);
    return ApiResponse.success(res, data, "Recipes retrieved successfully", 200);
  });

  getById = asyncHandler(async (req, res) => {
    const data = await service.getRecipeById(req.params.id);
    return ApiResponse.success(res, data, "Recipe retrieved successfully", 200);
  });

  createRecipe = asyncHandler(async (req, res) => {
    const validated = await RecipeDTO.validate(RecipeDTO.createSchema(), req.body);
  

    // 2. Ambil file (sesuaikan jika Anda menggunakan upload.single atau upload.fields)
    const file = req.file || (req.files?.image?.[0] || req.files?.video?.[0]);
    const hasYoutube = validated.youtubeUrl && validated.youtubeUrl.trim() !== "";

    // Kasus 1: Keduanya diisi (Pencegahan yang Anda minta)
    if (file && hasYoutube) {
        throw new AppError(
            "Pilih salah satu: Unggah file media (lokal) ATAU isi YouTube URL. Tidak boleh keduanya.", 
            400
        );
    }

    // Kasus 2: Keduanya kosong
    if (!file && !hasYoutube) {
        throw new AppError(
            "Media tidak boleh kosong. Silakan unggah file atau masukkan link YouTube.", 
            400
        );
    }

    const recipe = await service.createRecipe(
      validated,
      req.user.id,
      req.file
    );

    await logActivity({
      userId: req.user.id,
      action: "CREATE_RECIPE",
      type: "RECIPE",
      referenceId: recipe._id,
      description: `Recipe "${recipe.title}" created`,
    });

    return ApiResponse.success(
      res,
      recipe,
      "Recipe created",
      201
    );
  });

  updateRecipe = asyncHandler(async (req, res) => {
    const validated = await RecipeDTO.validate(RecipeDTO.updateSchema(), req.body);

    const recipe = await service.updateRecipe(
      req.params.id,
      validated,
      req.file
    );

    await logActivity({
      userId: req.user.id,
      action: "UPDATE_RECIPE",
      type: "RECIPE",
      referenceId: recipe._id,
      description: `Recipe "${recipe.title}" updated`,
    });

    return ApiResponse.success(
      res,
      recipe,
      "Recipe updated successfully",
      200
    );
  });

  deleteRecipe = asyncHandler(async (req, res) => {
    const validated = await RecipeDTO.validate(RecipeDTO.paramsIdSchema(), req.params);
    await service.deleteRecipe(validated.id);

    await logActivity({
      userId: req.user.id,
      action: "DELETE_RECIPE",
      type: "RECIPE",
      referenceId: validated.id,
      description: `Recipe with ID "${validated.id}" deleted`,
    });

    return ApiResponse.success(
      res,
      null,
      "Recipe deleted successfully",
      200
    );
  });
}

module.exports = new RecipeController();
