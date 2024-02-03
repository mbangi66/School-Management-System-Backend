const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// User Registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error registering user.' });
    }
    res.json({ success: true, message: 'User registered successfully.' });
  });
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error authenticating user.' });
    }

    // Check password
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate JWT token
      const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });

      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  });
});

module.exports = router;
