const RecipeService = require("../services/recipeServices");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;
const AppError = require("../utils/appError");
const MediaHelper = require("../utils/mediaHelper");
jest.mock("fs", () => ({
  promises: {
    unlink: jest.fn() // Buat ini jadi fungsi mock secara manual
  }
}));
jest.mock("../config/cloudinary");
jest.mock("../utils/mediaHelper");

describe("RecipeService Unit Test", () => {
  let recipeService;
  let mockRecipeRepository;

  beforeEach(() => {
    // Mock Repository
    mockRecipeRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    recipeService = new RecipeService(mockRecipeRepository);
    jest.clearAllMocks();
    
    // Default Mock fs.unlink agar tidak error saat dipanggil
    fs.unlink.mockResolvedValue(true);
  });

  // ==========================================
  // TEST GET RECIPE BY ID
  // ==========================================
  describe("getRecipeById", () => {
    test("Harus menambah jumlah views dan mengembalikan resep", async () => {
      const mockRecipe = { _id: "65d2f1b12345678901234567", title: "Nasi Goreng", views: 0 };
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);

      const result = await recipeService.getRecipeById(mockRecipe._id);

      expect(result.views).toBe(1);
      expect(mockRecipeRepository.save).toHaveBeenCalled();
      expect(result.title).toBe("Nasi Goreng");
    });

    test("Harus throw error 404 jika resep tidak ditemukan", async () => {
      mockRecipeRepository.findById.mockResolvedValue(null);
      
      await expect(recipeService.getRecipeById("65d2f1b12345678901234567"))
        .rejects.toThrow(new AppError("Recipe not found", 404));
    });
  });

  // ==========================================
  // TEST CREATE RECIPE
  // ==========================================
  describe("createRecipe", () => {
    const mockFile = { path: "temp/photo.jpg", mimetype: "image/jpeg" };
    const userId = "user123";

    test("Harus upload ke Cloudinary dan hapus file lokal jika ada file", async () => {
      mockRecipeRepository.findOne.mockResolvedValue(null);
      cloudinary.uploader.upload.mockResolvedValue({
        secure_url: "https://cloudinary.com/image.jpg",
        public_id: "id_123"
      });

      await recipeService.createRecipe({ title: "Soto" }, userId, mockFile);

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockFile.path, expect.any(Object));
      expect(fs.unlink).toHaveBeenCalledWith(mockFile.path); // Pastikan temp file dihapus
      expect(mockRecipeRepository.create).toHaveBeenCalled();
    });

    test("Harus throw error jika user membuat judul resep yang sama", async () => {
      mockRecipeRepository.findOne.mockResolvedValue({ title: "Soto" });

      await expect(recipeService.createRecipe({ title: "Soto" }, userId, mockFile))
        .rejects.toThrow(new AppError("Anda sudah pernah membuat resep dengan judul ini!", 400));
      
      // File harus tetap dihapus meski gagal create
      expect(fs.unlink).toHaveBeenCalledWith(mockFile.path);
    });

    test("Harus menggunakan Youtube URL jika tidak ada file yang diunggah", async () => {
      mockRecipeRepository.findOne.mockResolvedValue(null);
      MediaHelper.convertYoutubeToEmbed.mockReturnValue("https://youtube.com/embed/123");

      const data = { title: "Mie", youtubeUrl: "https://youtube.com/watch?v=123" };
      await recipeService.createRecipe(data, userId, null);

      expect(mockRecipeRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        media: expect.objectContaining({ type: "youtube" })
      }));
    });
  });

  // ==========================================
  // TEST DELETE RECIPE
  // ==========================================
  describe("deleteRecipe", () => {
    test("Harus menghapus resep dan media di Cloudinary", async () => {
      const mockRecipe = { 
        _id: "123", 
        media: { public_id: "pub_1", type: "image" } 
      };
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);

      await recipeService.deleteRecipe("123");

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("pub_1", expect.any(Object));
      expect(mockRecipeRepository.delete).toHaveBeenCalledWith("123");
    });
  });

  // ==========================================
  // TEST UPDATE RECIPE (Edge Case: Ganti Media)
  // ==========================================
  describe("updateRecipe", () => {
    test("Harus menghapus media lama jika mengunggah media baru", async () => {
      const oldRecipe = { 
        _id: "123", 
        media: { public_id: "old_id", type: "image" } 
      };
      mockRecipeRepository.findById.mockResolvedValue(oldRecipe);
      
      const newFile = { path: "temp/new.jpg", mimetype: "image/jpeg" };
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: "new_url", public_id: "new_id" });

      await recipeService.updateRecipe("123", { title: "Update" }, newFile);

      // Pastikan destroy media lama dipanggil
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("old_id", expect.any(Object));
      expect(fs.unlink).toHaveBeenCalledWith(newFile.path);
    });
  });
});