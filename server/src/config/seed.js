import bcrypt from "bcryptjs";
import { Comic } from "../models/Comic.js";
import { Chapter } from "../models/Chapter.js";
import { User } from "../models/User.js";

const demoComics = [
  {
    title: "Prism of Midnight Hearts",
    description:
      "A rising idol and an underground artist discover an unexpected bond while navigating fame, secrets, and found family.",
    status: "Ongoing",
    cover_image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=800&q=80",
    tags: ["Romance", "Drama", "Music", "Yaoi"],
    featured: true,
    chapters: [
      {
        chapter_number: 1,
        title: "First Stage",
        images: [
          "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
        ],
        is_premium: false,
        price_in_coins: 0,
      },
      {
        chapter_number: 2,
        title: "Shared Spotlight",
        images: [
          "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
        ],
        is_premium: true,
        price_in_coins: 20,
      },
    ],
  },
  {
    title: "Moonlit Contract",
    description:
      "Two rivals sign a temporary partnership that quickly turns into something far more vulnerable and dangerous.",
    status: "Completed",
    cover_image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=800&q=80",
    tags: ["Thriller", "Romance", "Corporate", "Yaoi"],
    featured: true,
    chapters: [
      {
        chapter_number: 1,
        title: "Clause One",
        images: [
          "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&w=1200&q=80",
        ],
        is_premium: false,
        price_in_coins: 0,
      },
      {
        chapter_number: 2,
        title: "Clause Two",
        images: [
          "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1555922204-3f49e2482e95?auto=format&fit=crop&w=1200&q=80",
        ],
        is_premium: true,
        price_in_coins: 25,
      },
    ],
  },
];

export const seedDatabase = async () => {
  const comicCount = await Comic.countDocuments();
  if (comicCount === 0) {
    for (const comicData of demoComics) {
      const { chapters, ...comicPayload } = comicData;
      const comic = await Comic.create(comicPayload);
      for (const chapterData of chapters) {
        const chapter = await Chapter.create({
          ...chapterData,
          comic: comic._id,
        });
        comic.chapters.push({
          chapter_ref: chapter._id,
          ...chapterData,
        });
      }
      await comic.save();
    }
    console.log("Seeded demo comics and chapters.");
  }

  const adminEmail = "admin@prismyaoi.com";
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      username: "prism_admin",
      email: adminEmail,
      password: await bcrypt.hash("admin123", 10),
      role: "Admin",
      coin_balance: 500,
    });
    console.log("Seeded default admin user.");
  }
};
