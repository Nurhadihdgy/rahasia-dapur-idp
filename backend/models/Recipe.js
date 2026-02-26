const { required } = require("joi");
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true, // Tidak boleh ada judul yang sama di seluruh DB
    required: true,
    trim: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  ingredients: [String],
  steps: [String],

  views: {
    type: Number,
    default: 0,
  },

  media: {
    type: {
      type: String,
      enum: ["image", "video", "youtube"],
    },
    url: String,
    public_id: String,
    thumbnail: String,
    duration: Number,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
