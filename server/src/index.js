import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./config/seed.js";
import authRoutes from "./routes/authRoutes.js";
import comicRoutes from "./routes/comicRoutes.js";
import coinRoutes from "./routes/coinRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "PrismYaoi API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/comics", comicRoutes);
app.use("/api/coins", coinRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error", error: error.message });
});

const bootstrap = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`PrismYaoi API running on http://localhost:${PORT}`);
  });
};

bootstrap();
