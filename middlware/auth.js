import jwt from "jsonwebtoken";
import { handleJWTError } from "../utils/errorhandler.js";
export const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(handleJWTError());
    }
    req.user = decoded;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .json({ message: "only admins can access this routes" });
  }
  next();
};

export const isManagerOrAdmin = (req, res, next) => {
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(401).json({ message: "you can not access this routes " });
  }
  next();
};
