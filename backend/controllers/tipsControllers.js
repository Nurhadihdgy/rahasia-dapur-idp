const Tips = require("../models/Tips");
const TipsRepository = require("../repository/tipsRepository");
const TipsService = require("../services/tipsServices");
const ApiResponse = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");
const TipsDTO = require("../dto/tipsDTO");
const fs = require("fs").promises;
const AppError = require("../utils/appError");
const logActivity = require("../utils/activityLogger");

const repository = new TipsRepository(Tips);
const service = new TipsService(repository);

class TipsController {
  getAll = asyncHandler(async (req, res) => {
    // Pastikan menggunakan req.query
    const validated = await TipsDTO.validate(TipsDTO.querySchema(), req.query);

    const data = await service.getTips(validated);
    return ApiResponse.success(res, data, "Tips retrieved successfully", 200);
  });

  getById = asyncHandler(async (req, res) => {
    const validated = await TipsDTO.validate(
      TipsDTO.paramIdSchema(),
      req.params,
    );
    const data = await service.getTipById(validated.id);
    return ApiResponse.success(res, data, "Tips retrieved successfully", 200);
  });

  getTrending = asyncHandler(async (req, res) => {
    const data = await service.getTrending();
    return ApiResponse.success(
      res,
      data,
      "Trending tips retrieved successfully",
      200,
    );
  });

  toggleLike = asyncHandler(async (req, res) => {
    const data = await service.toggleLike(req.params.id, req.user.id);
    await logActivity({
      userId: req.user.id,
      action: data.liked ? "LIKE_TIPS" : "UNLIKE_TIPS",
      type: "TIPS",
      referenceId: req.params.id,
      description: `User ${req.user.id} ${data.liked ? "liked" : "unliked"} tips ${req.params.id}`,
    });
    return ApiResponse.success(
      res,
      data,
      "Tip like status toggled successfully",
      200,
    );
  });

  create = asyncHandler(async (req, res) => {
    const validated = await TipsDTO.validate(TipsDTO.createSchema(), req.body);

    const file = req.file || req.files?.image?.[0] || req.files?.video?.[0];
    const hasYoutube =
      validated.youtubeUrl && validated.youtubeUrl.trim() !== "";

    if (file && hasYoutube) {
      throw new AppError(
        "Pilih salah satu: Unggah file media (lokal) ATAU isi YouTube URL. Tidak boleh keduanya.",
        400,
      );
    }

    if (!file && !hasYoutube) {
      throw new AppError(
        "Media tidak boleh kosong. Silakan unggah file atau masukkan link YouTube.",
        400,
      );
    }

    const tip = await service.createTip(validated, req.user.id, req.file);

    await logActivity({
      userId: req.user.id,
      action: "CREATE_TIPS",
      type: "TIPS",
      referenceId: tip._id,
      description: `Tips "${tip.title}" created`,
    });

    return ApiResponse.success(res, tip, "Tip created successfully", 201);
  });

  update = asyncHandler(async (req, res) => {
    const validated = await TipsDTO.validate(TipsDTO.updateSchema(), req.body);

    if (
      req.file &&
      validated.youtubeUrl &&
      validated.youtubeUrl.trim() !== ""
    ) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      throw new AppError(
        "Tidak boleh mengubah ke file media dan YouTube URL secara bersamaan.",
        400,
      );
    }

    const tip = await service.updateTip(req.params.id, validated, req.file);

    await logActivity({
      userId: req.user.id,
      action: "UPDATE_TIPS",
      type: "TIPS",
      referenceId: tip._id,
      description: `Tips "${tip.title}" updated`,
    });

    return ApiResponse.success(res, tip, "Tip updated successfully", 200);
  });

  deleteTip = asyncHandler(async (req, res) => {
    const validated = await TipsDTO.validate(
      TipsDTO.paramIdSchema(),
      req.params,
    );
    await service.deleteTip(validated.id);
    await logActivity({
      userId: req.user.id,
      action: "DELETE_TIPS",
      type: "TIPS",
      referenceId: validated.id,
      description: `Tips ${validated.id} deleted`,
    });
    return ApiResponse.success(res, null, "Tips deleted successfully", 200);
  });
}

module.exports = new TipsController();
