const { verifyToken } = require('../config/auth');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token nicht gefunden' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Ungültiger oder abgelaufener Token' });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
