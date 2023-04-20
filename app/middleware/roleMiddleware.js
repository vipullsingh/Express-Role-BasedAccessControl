const { ROLES } = require('../utils/constants');

// Middleware to set default role to user
const roleMiddleware = (req, res, next) => {
  const userRole = req.session.user?.role || ROLES.USER;
  req.session.user.role = userRole;
  next();
};

module.exports = roleMiddleware;
