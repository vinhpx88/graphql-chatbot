import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return { user: null, error: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return { user };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { user: null, error: 'Token expired' };
    }
    return { user: null, error: 'Invalid token' };
  }
};

export default auth;
