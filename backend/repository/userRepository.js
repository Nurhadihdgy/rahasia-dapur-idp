class UserRepository {
  constructor(UserModel) {
    this.User = UserModel;
  }

  async findAll(query, page, limit) {
    const users = await this.User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.User.countDocuments(query);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users,
    };
  }

  async addRefreshToken(userId, refreshTokenData) {
    return this.User.findByIdAndUpdate(
      userId,
      {
        $push: { refreshTokens: refreshTokenData },
      },
      { new: true }
    );
  }

  async findById(id) {
    return this.User.findById(id).select("-password");
  }

  async findByIdRaw(id) {
    return this.User.findById(id);
  }

  async findByIdWithRefreshToken(id) {
    return await this.User.findById(id);
  }

  async findByEmail(email) {
    return await this.User.findOne({ email })
  }

  async findByEmailAndPassword (email) {
    return await this.User.findOne({ email }).select("+password");
  }

  async create(data) {
    return this.User.create(data);
  }

  async save(user) {
    return user.save();
  }

  async updatePassword(id, hashedPassword) {
  return this.User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
}
  async delete(id) {
    return this.User.findByIdAndDelete(id);
  }

  async removeSpecificToken(userId, token) {
    if (!userId) return null;
    return this.User.findByIdAndUpdate(
        userId,
        { $pull: { refreshTokens: { token: token } } }
    );
}

async rotateToken(userId, oldToken, newTokenData) {
  return this.User.findOneAndUpdate(
    { _id: userId, "refreshTokens.token": oldToken }, // Cari user dan token spesifik
    { 
      $set: { "refreshTokens.$": newTokenData } // Simbol $ merujuk pada index yang ditemukan
    },
    { new: true }
  );
}

// Menghapus semua token (Logout All)
async clearAllTokens(userId) {
    return this.User.findByIdAndUpdate(
        userId,
        { $set: { refreshTokens: [] } }
    );
}

  async removeRefreshTokenByDevice(userId, deviceName) {
  return this.User.findByIdAndUpdate(
    userId,
    {
      // $pull akan menghapus elemen array yang cocok dengan kriteria
      $pull: { refreshTokens: { device: deviceName } }
    }
  );
}

  async findByIdWithPassword(id) {
    return this.User.findById(id).select("+password");
  }
}

module.exports = UserRepository;
