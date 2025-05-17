import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    //  authentication middleware sets req.id or req.userId
    const userId = req.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
