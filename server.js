const express = require('express');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
