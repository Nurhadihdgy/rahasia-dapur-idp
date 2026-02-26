// 1. Mock fs.promises secara eksplisit di awal
jest.mock("fs", () => ({
  promises: {
    unlink: jest.fn()
  }
}));

const TipsService = require("../services/tipsServices");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;
const AppError = require("../utils/appError");
const MediaHelper = require("../utils/mediaHelper");

// Mocking dependencies lainnya
jest.mock("../config/cloudinary");
jest.mock("../utils/mediaHelper");

describe("TipsService Unit Test", () => {
  let tipsService;
  let mockTipsRepository;

  beforeEach(() => {
    mockTipsRepository = {
      findAll: jest.fn(),
      findByIdRaw: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn()
    };

    tipsService = new TipsService(mockTipsRepository);
    jest.clearAllMocks();
    fs.unlink.mockResolvedValue(true);
  });

  // ==========================================
  // TEST GET TIPS (WITH LIKES COUNT)
  // ==========================================
  describe("getTips", () => {
    test("Harus mengembalikan tips dengan totalLikes yang dihitung", async () => {
      const mockTips = [
        { title: "Tips 1", likes: ["user1", "user2"] },
        { title: "Tips 2", likes: [] }
      ];
      mockTipsRepository.findAll.mockResolvedValue({ tips: mockTips, total: 2 });

      const result = await tipsService.getTips({ page: 1, limit: 10 });

      expect(result.tips[0].likesCount).toBe(2);
      expect(result.tips[1].likesCount).toBe(0);
      expect(result.totalPages).toBe(1);
    });
  });

  // ==========================================
  // TEST TOGGLE LIKE (LOGIK BOLEAN)
  // ==========================================
  describe("toggleLike", () => {
    test("Harus melakukan 'pull' (unlike) jika user sudah pernah like", async () => {
      const mockTip = { 
        likes: { 
          includes: jest.fn().mockReturnValue(true), 
          pull: jest.fn(),
          length: 1 
        } 
      };
      mockTipsRepository.findByIdRaw.mockResolvedValue(mockTip);

      const result = await tipsService.toggleLike("tip123", "user123");

      expect(mockTip.likes.pull).toHaveBeenCalledWith("user123");
      expect(result.liked).toBe(false);
      expect(mockTipsRepository.save).toHaveBeenCalled();
    });

    test("Harus melakukan 'push' (like) jika user belum pernah like", async () => {
      const mockTip = { 
        likes: { 
          includes: jest.fn().mockReturnValue(false), 
          push: jest.fn(),
          length: 1 
        } 
      };
      mockTipsRepository.findByIdRaw.mockResolvedValue(mockTip);

      const result = await tipsService.toggleLike("tip123", "user123");

      expect(mockTip.likes.push).toHaveBeenCalledWith("user123");
      expect(result.liked).toBe(true);
    });
  });

  // ==========================================
  // TEST MEDIA UPLOAD & CLEANUP
  // ==========================================
  describe("createTip with Media", () => {
    test("Harus upload ke cloudinary dan hapus file lokal saat sukses", async () => {
      const mockFile = { path: "temp/video.mp4", mimetype: "video/mp4" };
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: "url", public_id: "id" });
      mockTipsRepository.create.mockResolvedValue({ id: "1" });

      await tipsService.createTip({ title: "Tips" }, "user1", mockFile);

      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(fs.unlink).toHaveBeenCalledWith("temp/video.mp4");
    });

    test("Harus tetap hapus file lokal saat upload cloudinary GAGAL", async () => {
      const mockFile = { path: "temp/error.jpg", mimetype: "image/jpg" };
      cloudinary.uploader.upload.mockRejectedValue(new Error("Cloudinary Error"));

      await expect(tipsService.createTip({ title: "Tips" }, "user1", mockFile))
        .rejects.toThrow(AppError);

      expect(fs.unlink).toHaveBeenCalledWith("temp/error.jpg");
    });
  });

  // ==========================================
  // TEST TRENDING (AGGREGATION)
  // ==========================================
  describe("getTrending", () => {
    test("Harus memanggil fungsi aggregate repository", async () => {
      mockTipsRepository.aggregate.mockResolvedValue([{ title: "Trending 1" }]);
      
      const result = await tipsService.getTrending();
      
      expect(mockTipsRepository.aggregate).toHaveBeenCalledWith(expect.any(Array));
      expect(result[0].title).toBe("Trending 1");
    });
  });
});