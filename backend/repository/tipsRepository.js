class TipsRepository {
  constructor(TipsModel) {
    this.Tips = TipsModel;
  }

  async findAll(query, page, limit) {
    const skip = (page - 1) * limit;

    const tips = await this.Tips.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name photo")
      .lean();

    const total = await this.Tips.countDocuments(query);

    return { tips, total };
  }

  async findById(id) {
    return await this.Tips.findById(id)
      .populate("createdBy", "name photo")
      .lean();
  }

  async findByIdRaw(id) {
    return this.Tips.findById(id);
  }

  async create(data) {
    return this.Tips.create(data);
  }

  async save(document) {
    return document.save();
  }

  async delete(id) {
    return this.Tips.findByIdAndDelete(id);
  }

  async aggregate(pipeline) {
    return this.Tips.aggregate(pipeline);
  }
}

module.exports = TipsRepository;
