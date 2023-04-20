const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

// Import routes and middleware functions
const authRoutes = require('./app/routes/authRoutes');
const profileRoutes = require('./app/routes/profileRoutes');
const userRoutes = require('./app/routes/userRoutes');
const authMiddleware = require('./app/middleware/authMiddleware');
const roleMiddleware = require('./app/middleware/roleMiddleware');

// Set up middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(authMiddleware);

// Connect to database
const database = require('./app/utils/database');
database.connect();

// Register routes
app.use('/auth', authRoutes);
app.use('/profile', roleMiddleware(['Super Admin', 'Admin', 'User']), profileRoutes);
app.use('/users', roleMiddleware(['Super Admin', 'Admin']), userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
