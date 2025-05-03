// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'mysecretkey123';
const fs = require('fs');

// MySQL setup (adjust user/password/db as needed)
const db = mysql.createConnection({
  host     : 'db-mysql-nyc3-50363-do-user-18890227-0.k.db.ondigitalocean.com',
  user     : 'doadmin',
  password : 'process.env.DB_PASSWORD',
  port     : 25060 ,
  database : 'defaultdb',
  ssl      : false
});
db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

app.use(cors());
app.use(bodyParser.json());

// JWT middleware
function authenticateToken(req, res, next) {
  const h = req.headers['authorization'];
  const token = h && h.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Login → returns JWT
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Mariam' && password === 'Mariam') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Chart1 endpoint
app.get('/api/chart1', authenticateToken, (req, res) => {
  db.query('SELECT year, course_count FROM duolingo_courses ORDER BY year', (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    res.json({
      labels: rows.map(r => r.industry),
      values: rows.map(r => r.adoption_rate)
    });
  });
});

// Chart2 endpoint Duolingo UI Language Support
app.get('/api/chart2', (req, res) => {
  const query = 'SELECT year, ui_languages FROM duolingo_ui_languages';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    
    const labels = results.map(row => row.year.toString());
    const values = results.map(row => row.ui_languages);

    res.json({ labels, values });
  });
});



// Serve Angular app
const distPath = path.join(__dirname, '..', 'M19-angular-app', 'dist', 'M19-angular-app');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
