import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

export const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }
    if (user.is_banned) {
      return res.status(403).json({ message: "User is banned" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
