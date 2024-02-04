const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');
const cors = require('cors');
const authenticateToken = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use('/users', userRoutes);

app.use(bodyParser.json());

// Define a route to fetch students from the database
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ students: rows });
  });
});

// Add a new student to the database
app.post('/students', (req, res) => {
  const { name, grade, age, subject, year, type, photo } = req.body;

  if (!name || !grade || !age || !subject || !year || !type || !photo) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  db.run(
    'INSERT INTO students (name, grade, age, subject, year, type, photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, grade, age, subject, year, type, photo],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ id: this.lastID });
    }
  );
});

// Update an existing student
app.put('/students/:id', (req, res) => {
  const { name, grade, age, subject, year, type, photo } = req.body;
  const studentId = req.params.id;

  db.run(
    'UPDATE students SET name=?, grade=?, age=?, subject=?, year=?, type=?, photo=? WHERE id=?',
    [name, grade, age, subject, year, type, photo, studentId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ success: true });
    }
  );
});

// Delete a student
app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;

  db.run('DELETE FROM students WHERE id=?', [studentId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ success: true });
  });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This route is protected.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
