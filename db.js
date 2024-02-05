const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./database.db');

// Create a 'students' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade TEXT,
    age INTEGER,
    subject TEXT,
    year INTEGER, 
    classNumber TEXT, 
    type TEXT, 
    photo TEXT 
  )
`);

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);
});

const getFilteredStudents = (filter, year, classNumber) => {
  // Build your SQL query dynamically based on the provided criteria
  let query = 'SELECT * FROM students WHERE 1=1';
  const params = [];

  if (filter) {
    query += ' AND type = ?';
    params.push(filter);
  }

  if (year) {
    query += ' AND year = ?';
    params.push(year);
  }

  if (classNumber) {
    query += ' AND classNumber = ?';
    params.push(classNumber);
  }

  // Execute the query and return the result
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = { getFilteredStudents, db };

