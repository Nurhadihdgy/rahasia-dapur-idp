const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const MediaHelper = require("../utils/mediaHelper");
const fs = require("fs").promises; // <--- TAMBAHKAN BARIS INI
const path = require("path");

class RecipeService {
  constructor(recipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  // ==============================
  // GET ALL
  // ==============================
  async getRecipes({ search, page = 1, limit = 6 }) {
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    return this.recipeRepository.findAll(
      query,
      parseInt(page),
      parseInt(limit),
    );
  }

  // ==============================
  // GET BY ID
  // ==============================
  async getRecipeById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Recipe ID", 400);
    }

    const recipe = await this.recipeRepository.findById(id);

    if (!recipe) {
      throw new AppError("Recipe not found", 404);
    }

    recipe.views += 1;
    await this.recipeRepository.save(recipe);

    return recipe;
  }

  async _handleMediaUpload(file, folder = "rahasia-dapur/recipes") {
    if (!file) return null;

    try {
      const isVideo = file.mimetype.startsWith("video");
      
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: "auto",
        transformation: isVideo 
          ? [{ quality: "auto" }] 
          : [{ width: 1000, crop: "limit", quality: "auto", fetch_format: "auto" }]
      });

      // Hapus file dari folder temp secara async (Fire and Forget)
      fs.unlink(file.path).catch(err => console.error("Temp file cleanup failed:", err));

      return {
        type: isVideo ? "video" : "image",
        url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration || null,
        thumbnail: isVideo 
          ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") // Ganti ekstensi video ke jpg untuk thumb
          : result.secure_url
      };
    } catch (error) {
      // Jika upload gagal, tetap coba hapus file temp
      fs.unlink(file.path).catch(() => {}); 
      throw new AppError("Gagal mengunggah media ke Cloudinary", 500);
    }
  }

  async _deleteMediaFromCloudinary(publicId, type) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: type === "video" ? "video" : "image",
      });
    } catch (error) {
      console.error("Cloudinary Delete Error:", error);
    }
  }

  async createRecipe(data, userId, file) {
    const existingRecipe = await this.recipeRepository.findOne({
      title: data.title,
      createdBy: userId,
    });

    if (existingRecipe) {
      if (file) await fs.unlink(file.path).catch(() => {});
      throw new AppError("Anda sudah pernah membuat resep dengan judul ini!", 400);
    }

    let mediaData = null;

    if (file) {
      mediaData = await this._handleMediaUpload(file);
    } else if (data.youtubeUrl) {
      mediaData = {
        type: "youtube",
        url: MediaHelper.convertYoutubeToEmbed(data.youtubeUrl),
        thumbnail: MediaHelper.getYoutubeThumbnail(data.youtubeUrl),
      };
    }

    return await this.recipeRepository.create({
      ...data,
      media: mediaData,
      createdBy: userId,
    });
  }

  async updateRecipe(id, data, file) {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      if (file) await fs.unlink(file.path).catch(() => {});
      throw new AppError("Recipe not found", 404);
    }

    // Jika ada upload file baru ATAU youtubeUrl baru dikirim
    if (file || (data.youtubeUrl && data.youtubeUrl !== recipe.media?.url)) {
      
      // Hapus media lama di Cloudinary jika ada
      if (recipe.media?.public_id) {
        this._deleteMediaFromCloudinary(recipe.media.public_id, recipe.media.type);
      }

      if (file) {
        recipe.media = await this._handleMediaUpload(file);
      } else {
        recipe.media = {
          type: "youtube",
          url: MediaHelper.convertYoutubeToEmbed(data.youtubeUrl),
          thumbnail: MediaHelper.getYoutubeThumbnail(data.youtubeUrl),
        };
      }
    }

    const { media, ...otherData } = data;
    Object.assign(recipe, otherData);

    await this.recipeRepository.save(recipe);
    return recipe;
  }

  async deleteRecipe(id) {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) throw new AppError("Recipe not found", 404);

    if (recipe.media?.public_id) {
      this._deleteMediaFromCloudinary(recipe.media.public_id, recipe.media.type);
    }

    await this.recipeRepository.delete(id);
    return true;
  }
}

module.exports = RecipeService;
