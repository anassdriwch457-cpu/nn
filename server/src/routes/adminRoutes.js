import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { Comic } from "../models/Comic.js";
import { User } from "../models/User.js";
import { Chapter } from "../models/Chapter.js";
import { Transaction } from "../models/Transaction.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/analytics", async (_req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const dailyStart = new Date();
  dailyStart.setDate(now.getDate() - 6);
  dailyStart.setHours(0, 0, 0, 0);

  const [totalUsers, monthlyRevenueRows, topComics, dailyTransactions] = await Promise.all([
    User.countDocuments({}),
    Transaction.aggregate([
      {
        $match: {
          type: "Top-up",
          status: "Success",
          timestamp: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" },
        },
      },
    ]),
    Comic.find().sort({ total_views: -1 }).limit(5).select("title total_views"),
    Transaction.aggregate([
      {
        $match: {
          status: "Success",
          timestamp: { $gte: dailyStart },
        },
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          type: 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: {
            day: "$day",
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.day": 1,
        },
      },
    ]),
  ]);

  return res.json({
    totalUsers,
    monthlyRevenue: monthlyRevenueRows[0]?.amount || 0,
    topComics,
    dailyCoinTransactions: dailyTransactions,
  });
});

router.post("/comics", async (req, res) => {
  const { title, description, status, cover_image, tags, featured } = req.body;
  if (!title || !description || !cover_image) {
    return res.status(400).json({ message: "title, description and cover_image are required" });
  }

  const comic = await Comic.create({
    title,
    description,
    status,
    cover_image,
    tags: Array.isArray(tags) ? tags : [],
    featured: Boolean(featured),
  });

  return res.status(201).json(comic);
});

router.post("/comics/:comicId/chapters", async (req, res) => {
  const { chapter_number, title, images, is_premium, price_in_coins } = req.body;
  if (!chapter_number || !title || !Array.isArray(images) || images.length === 0) {
    return res
      .status(400)
      .json({ message: "chapter_number, title and images are required (images[] must not be empty)" });
  }

  const comic = await Comic.findById(req.params.comicId);
  if (!comic) {
    return res.status(404).json({ message: "Comic not found" });
  }

  const chapter = await Chapter.create({
    comic: comic._id,
    chapter_number,
    title,
    images,
    is_premium: Boolean(is_premium),
    price_in_coins: Number(price_in_coins || 0),
  });

  comic.chapters.push({
    chapter_ref: chapter._id,
    chapter_number: chapter.chapter_number,
    title: chapter.title,
    images: chapter.images,
    is_premium: chapter.is_premium,
    price_in_coins: chapter.price_in_coins,
  });
  await comic.save();

  return res.status(201).json(chapter);
});

router.get("/users", async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json(users);
});

router.patch("/users/:userId/ban", async (req, res) => {
  const { banned } = req.body;
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.is_banned = Boolean(banned);
  await user.save();

  return res.json({
    message: `User ${user.is_banned ? "banned" : "unbanned"} successfully`,
    user,
  });
});

router.patch("/users/:userId/coins", async (req, res) => {
  const { amount } = req.body;
  if (!Number.isInteger(amount)) {
    return res.status(400).json({ message: "amount must be an integer" });
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.coin_balance = Math.max(0, user.coin_balance + amount);
  await user.save();

  return res.json({
    message: "Coin balance adjusted",
    user,
  });
});

export default router;
