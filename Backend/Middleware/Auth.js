import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    if (!req.cookies) {
      return res.status(401).json({
        success: false,
        message: "No cookies found. Please log in.",
      });
    }
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Token decode error" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
