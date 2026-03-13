import mongoose from "mongoose";

const chapterPreviewSchema = new mongoose.Schema(
  {
    chapter_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
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
  { _id: false }
);

const comicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed"],
      default: "Ongoing",
    },
    cover_image: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    total_views: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    chapters: [chapterPreviewSchema],
  },
  { timestamps: true }
);

export const Comic = mongoose.model("Comic", comicSchema);
