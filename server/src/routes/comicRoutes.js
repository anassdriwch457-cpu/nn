import express from "express";
import jwt from "jsonwebtoken";
import { Comic } from "../models/Comic.js";
import { Chapter } from "../models/Chapter.js";
import { User } from "../models/User.js";

const router = express.Router();

const getOptionalUser = async (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return await User.findById(decoded.id);
  } catch (error) {
    return null;
  }
};

router.get("/", async (req, res) => {
  const comics = await Comic.find().sort({ createdAt: -1 }).limit(30);
  return res.json(comics);
});

router.get("/featured", async (req, res) => {
  const featured = await Comic.find({ featured: true }).sort({ total_views: -1 }).limit(5);
  return res.json(featured);
});

router.get("/trending", async (req, res) => {
  const trending = await Comic.find().sort({ total_views: -1 }).limit(10);
  return res.json(trending);
});

router.get("/new-releases", async (req, res) => {
  const releases = await Comic.find().sort({ createdAt: -1 }).limit(12);
  return res.json(releases);
});

router.get("/:comicId/meta", async (req, res) => {
  const comic = await Comic.findById(req.params.comicId).select("title description tags cover_image");
  if (!comic) {
    return res.status(404).json({ message: "Comic not found" });
  }
  return res.json({
    title: `${comic.title} | PrismYaoi`,
    description: comic.description,
    image: comic.cover_image,
    keywords: comic.tags.join(", "),
  });
});

router.get("/:comicId", async (req, res) => {
  const [comic, user] = await Promise.all([
    Comic.findById(req.params.comicId),
    getOptionalUser(req),
  ]);
  if (!comic) {
    return res.status(404).json({ message: "Comic not found" });
  }

  const purchasedSet = new Set((user?.purchased_chapters || []).map((id) => id.toString()));
  const chapters = comic.chapters
    .slice()
    .sort((a, b) => a.chapter_number - b.chapter_number)
    .map((chapter) => {
      const chapterId = chapter.chapter_ref.toString();
      const hasAccess = !chapter.is_premium || purchasedSet.has(chapterId);
      return {
        ...chapter.toObject(),
        has_access: hasAccess,
        locked: !hasAccess,
      };
    });

  return res.json({
    ...comic.toObject(),
    chapters,
  });
});

router.get("/:comicId/chapters/:chapterId", async (req, res) => {
  const chapter = await Chapter.findOne({
    _id: req.params.chapterId,
    comic: req.params.comicId,
  });
  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  const user = await getOptionalUser(req);
  const hasAccess =
    !chapter.is_premium ||
    (user && user.purchased_chapters.map((id) => id.toString()).includes(chapter._id.toString()));

  if (!hasAccess) {
    return res.status(403).json({
      message: "This chapter is premium and locked",
      requires_purchase: true,
      price_in_coins: chapter.price_in_coins,
    });
  }

  const [previousChapter, nextChapter] = await Promise.all([
    Chapter.findOne({
      comic: req.params.comicId,
      chapter_number: { $lt: chapter.chapter_number },
    }).sort({ chapter_number: -1 }),
    Chapter.findOne({
      comic: req.params.comicId,
      chapter_number: { $gt: chapter.chapter_number },
    }).sort({ chapter_number: 1 }),
  ]);

  await Comic.findByIdAndUpdate(req.params.comicId, { $inc: { total_views: 1 } });

  return res.json({
    chapter,
    previousChapter: previousChapter
      ? { id: previousChapter._id, chapter_number: previousChapter.chapter_number }
      : null,
    nextChapter: nextChapter ? { id: nextChapter._id, chapter_number: nextChapter.chapter_number } : null,
  });
});

export default router;
