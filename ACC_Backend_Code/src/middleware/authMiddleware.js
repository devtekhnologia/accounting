const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ status: false, message: 'No token provided' });
  }

  jwt.verify(token, 'Tekhnologia1985#', (err, decoded) => {
    if (err) {
      return res.status(401).send({ status: false, message: 'Failed to authenticate token' });
    }

    req.user = decoded; // Add user information to req.user
    next();
  });
};

module.exports = authMiddleware;