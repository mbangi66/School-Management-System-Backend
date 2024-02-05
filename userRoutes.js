const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('./database.db');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

router.use(bodyParser.json());

// Check if a username is available
router.post('/check-username', async (req, res) => {
  const { username } = req.body;

  try {
    // Check if the username exists in the database
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    // If user is null, the username is available; otherwise, it's taken
    const isAvailable = !existingUser;
    res.json({ isAvailable });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ error: 'Error checking username availability.' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is available
    const isAvailable = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!isAvailable) {
      return res.status(400).json({ error: 'Username is already taken. Please choose a different username.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error registering user.' });
      }

      res.json({ success: true, message: 'User registered successfully.' });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Error during registration.' });
  }
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
      const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  });
});

module.exports = router;
