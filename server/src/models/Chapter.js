import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    comic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comic",
      required: true,
      index: true,
    },
    chapter_number: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    is_premium: {
      type: Boolean,
      default: false,
    },
    price_in_coins: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

chapterSchema.index({ comic: 1, chapter_number: 1 }, { unique: true });

export const Chapter = mongoose.model("Chapter", chapterSchema);
