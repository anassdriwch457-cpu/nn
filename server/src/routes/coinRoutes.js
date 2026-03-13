import express from "express";
import { protect } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { Chapter } from "../models/Chapter.js";

const router = express.Router();

router.post("/top-up", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ message: "amount must be a positive integer" });
    }

    req.user.coin_balance += amount;
    await req.user.save();

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type: "Top-up",
      status: "Success",
    });

    return res.status(201).json({
      message: "Coins added successfully",
      coin_balance: req.user.coin_balance,
      transaction,
    });
  } catch (error) {
    return res.status(500).json({ message: "Top-up failed", error: error.message });
  }
});

router.post("/unlock", protect, async (req, res) => {
  try {
    const { chapterId } = req.body;
    if (!chapterId) {
      return res.status(400).json({ message: "chapterId is required" });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    if (!chapter.is_premium) {
      return res.status(400).json({ message: "This chapter is free" });
    }

    const alreadyPurchased = req.user.purchased_chapters
      .map((id) => id.toString())
      .includes(chapter._id.toString());
    if (alreadyPurchased) {
      return res.status(200).json({
        message: "Chapter already unlocked",
        coin_balance: req.user.coin_balance,
      });
    }

    if (req.user.coin_balance < chapter.price_in_coins) {
      return res.status(400).json({
        message: "Not enough coins",
        required: chapter.price_in_coins,
        coin_balance: req.user.coin_balance,
      });
    }

    req.user.coin_balance -= chapter.price_in_coins;
    req.user.purchased_chapters.push(chapter._id);

    const comicIdStr = chapter.comic.toString();
    const libraryStr = req.user.library.map((id) => id.toString());
    if (!libraryStr.includes(comicIdStr)) {
      req.user.library.push(chapter.comic);
    }

    await req.user.save();

    const transaction = await Transaction.create({
      user: req.user._id,
      amount: chapter.price_in_coins,
      type: "Purchase",
      status: "Success",
      chapter: chapter._id,
    });

    return res.status(201).json({
      message: "Chapter unlocked successfully",
      coin_balance: req.user.coin_balance,
      transaction,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unlock failed", error: error.message });
  }
});

export default router;
