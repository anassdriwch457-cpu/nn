import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Purchase", "Top-up"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Success",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
