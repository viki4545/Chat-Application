import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

