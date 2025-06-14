const express = require('express');
const cors = require('cors'); // ✅ Add this line
const path = require('path');
const fs = require('fs');

const app = express();

// ✅ Allow CORS from your GitHub Pages frontend
app.use(cors({
  origin: 'https://sbclassic.github.io'
}));

// Serve static files
app.use(express.static('public'));

// Token storage
const VALID_TOKENS = new Map(); // { token: { book, format, expiresAt } }

// Token-secured file delivery
app.get('/download', (req, res) => {
  const { token } = req.query;
  const tokenData = VALID_TOKENS.get(token);

  if (!tokenData) return res.status(403).send('Invalid or expired token.');
  if (Date.now() > tokenData.expiresAt) {
    VALID_TOKENS.delete(token);
    return res.status(403).send('Token has expired.');
  }

  const downloadEntry = {
    book: tokenData.book,
    format: tokenData.format,
    timestamp: Date.now(),
    ip: req.ip,
  };

  const logPath = path.join(__dirname, 'public', 'downloads-data.js');
  const logContent = `window.downloadData = window.downloadData || [];\nwindow.downloadData.push(${JSON.stringify(downloadEntry)});`;
  fs.appendFileSync(logPath, '\n' + logContent);

  const fileMap = {
    'paradox-pdf': 'The_Paradox_of_Passion.pdf',
    'paradox-epub': 'The_Paradox_of_Passion.epub',
    'what-pdf': 'What_It_Took.pdf',
    'what-epub': 'What_It_Took.epub',
  };

  const fileName = fileMap[`${tokenData.book}-${tokenData.format}`];
  if (!fileName) return res.status(404).send('File not found.');

  const filePath = path.join(__dirname, 'public', fileName);
  res.download(filePath);
});

// Track download data
app.get('/api/tracking', (req, res) => {
  const logPath = path.join(__dirname, 'public', 'downloads-data.js');
  if (!fs.existsSync(logPath)) return res.json([]);
  const raw = fs.readFileSync(logPath, 'utf8');
  const matches = [...raw.matchAll(/downloadData\.push\((.*?)\);/g)];
  const entries = matches.map(m => JSON.parse(m[1]));
  res.json(entries);
});

// Generate token
app.get('/generate-token', (req, res) => {
  const { book, format } = req.query;
  const token = Math.random().toString(36).substring(2, 10);
  VALID_TOKENS.set(token, {
    book,
    format,
    expiresAt: Date.now() + 10 * 60 * 1000
  });
  res.send({ token });
});

// Thank-you pages
app.get('/thankyou-paradox', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thankyou-paradox.html'));
});
app.get('/thankyou-what-it-took', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thankyou-what-it-took.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});