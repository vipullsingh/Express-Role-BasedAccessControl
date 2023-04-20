const jwt = require('jsonwebtoken');
const { ROLES } = require('../utils/constants');

// Middleware to authenticate user by verifying JWT
const authUser = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).send({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Invalid token' });
  }
};

// Middleware to authorize user based on role
const authRole = (role) => {
  return (req, res, next) => {
    const userRole = req.session.user.role;

    if (userRole !== role && userRole !== ROLES.SUPER_ADMIN) {
      return res.status(403).send({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = { authUser, authRole };
