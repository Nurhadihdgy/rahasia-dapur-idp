const AppError = require("../utils/appError");
const cloudinary = require("../config/cloudinary");
const MediaHelper = require("../utils/mediaHelper");
const fs = require("fs").promises;

class TipsService {
  constructor(tipsRepository) {
    this.tipsRepository = tipsRepository;
  }

  // Helper Tunggal untuk Upload & Cleanup
  async _handleMediaUpload(file, folder = "rahasia-dapur/tips") {
    if (!file) return null;
    try {
      const isVideo = file.mimetype.startsWith("video");
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: "auto",
        transformation: isVideo ? [{ quality: "auto" }] : [{ width: 800, quality: "auto" }]
      });

      // Cleanup file lokal
      fs.unlink(file.path).catch(err => console.error("Temp cleanup error:", err));

      return {
        type: isVideo ? "video" : "image",
        url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration || null,
        thumbnail: isVideo ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : result.secure_url
      };
    } catch (error) {
      if (file) await fs.unlink(file.path).catch(() => {});
      throw new AppError("Gagal mengunggah media ke cloud", 500);
    }
  }

  async _deleteMedia(publicId, type) {
    if (publicId) {
      cloudinary.uploader.destroy(publicId, { resource_type: type === "video" ? "video" : "image" }).catch(() => {});
    }
  }

  async getTips(params) {
  const { search, page, limit } = params;
  const query = search ? { title: { $regex: search, $options: "i" } } : {};
  
  const { tips, total } = await this.tipsRepository.findAll(query, page, limit);

  const tipsWithLikes = tips.map(tip => ({
    ...tip,
    likesCount: tip.likes ? tip.likes.length : 0
  }));

  return { 
    total, 
    page, 
    totalPages: Math.ceil(total / limit), 
    tips: tipsWithLikes 
  };
}

async getTipById(id) {
  const tipDoc = await this.tipsRepository.findByIdRaw(id);
  if (!tipDoc) throw new AppError("Tips tidak ditemukan", 404);
  
  tipDoc.views += 1;
  await this.tipsRepository.save(tipDoc);

  const tipData = await this.tipsRepository.findById(id);
  
  return {
    ...tipData,
    likesCount: tipData.likes ? tipData.likes.length : 0
  };
}

  async createTip(data, userId, file) {
    const mediaData = file 
      ? await this._handleMediaUpload(file) 
      : (data.youtubeUrl ? {
          type: "youtube",
          url: MediaHelper.convertYoutubeToEmbed(data.youtubeUrl),
          thumbnail: MediaHelper.getYoutubeThumbnail(data.youtubeUrl)
        } : null);

    return await this.tipsRepository.create({ ...data, media: mediaData, createdBy: userId });
  }

  async updateTip(id, data, file) {
    const tip = await this.tipsRepository.findByIdRaw(id);
    if (!tip) {
        if (file) await fs.unlink(file.path).catch(() => {});
        throw new AppError("Tips tidak ditemukan", 404);
    }

    if (file || (data.youtubeUrl && data.youtubeUrl !== tip.media?.url)) {
      this._deleteMedia(tip.media?.public_id, tip.media?.type);
      tip.media = file 
        ? await this._handleMediaUpload(file)
        : {
            type: "youtube",
            url: MediaHelper.convertYoutubeToEmbed(data.youtubeUrl),
            thumbnail: MediaHelper.getYoutubeThumbnail(data.youtubeUrl)
          };
    }

    Object.assign(tip, data);
    await this.tipsRepository.save(tip);
    return tip;
  }

  async deleteTip(id) {
    const tip = await this.tipsRepository.findByIdRaw(id);
    if (!tip) throw new AppError("Tips tidak ditemukan", 404);
    this._deleteMedia(tip.media?.public_id, tip.media?.type);
    return await this.tipsRepository.delete(id);
  }

  async toggleLike(id, userId) {
    const tip = await this.tipsRepository.findByIdRaw(id);
    if (!tip) throw new AppError("Tips tidak ditemukan", 404);
    
    const isLiked = tip.likes.includes(userId);
    isLiked ? tip.likes.pull(userId) : tip.likes.push(userId);
    await this.tipsRepository.save(tip);
    
    return { liked: !isLiked, totalLikes: tip.likes.length };
  }

  async getTrending() {
    return this.tipsRepository.aggregate([
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $addFields: { score: { $add: ["$views", { $multiply: ["$likesCount", 3] }] } } },
      { $sort: { score: -1 } },
      { $limit: 5 }
    ]);
  }
}

module.exports = TipsService;