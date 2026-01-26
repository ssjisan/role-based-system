const User = require("../models/userModel.js");
const { verifyToken } = require("./verifyToken.js");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId)
      .select("role email")
      .populate("role", "name");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ attach full user
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticate };
