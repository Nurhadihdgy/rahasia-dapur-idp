const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: {
    required: true,
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  refreshTokens: [
    {
      token: String,
      device: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
