const mongoose = require("mongoose");

const tipsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
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

    views: { type: Number, default: 0 },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // auto createdAt & updatedAt
  },
);

module.exports = mongoose.model("Tips", tipsSchema);
