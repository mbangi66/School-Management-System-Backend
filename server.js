const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

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
    const { name, grade, age, subject } = req.body;
    if (!name || !grade || !age || !subject) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
  
    db.run(
      'INSERT INTO students (name, grade, age, subject) VALUES (?, ?, ?, ?)',
      [name, grade, age, subject],
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
    const { name, grade, age, subject } = req.body;
    const studentId = req.params.id;
  
    db.run(
      'UPDATE students SET name=?, grade=?, age=?, subject=? WHERE id=?',
      [name, grade, age, subject, studentId],
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
