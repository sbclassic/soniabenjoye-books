// DEBUG TRIGGER - 2025-07-09

console.log("🔥 SERVER STARTED SUCCESSFULLY");

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// ✅ CORS
app.use(cors({
  origin: 'https://sbclassic.github.io'
}));

// ✅ Static files
app.use(express.static('public'));

// ===============================
// 📦 TOKEN FILE STORAGE SYSTEM
// ===============================
const TOKEN_FILE = path.join(__dirname, 'tokens.json');

function loadTokens() {
  try {
    if (!fs.existsSync(TOKEN_FILE)) return {};
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  } catch (err) {
    return {};
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

// ===============================
// 🔑 GENERATE TOKEN
// ===============================
app.get('/generate-token', (req, res) => {
  const { book, format, label = '', page = '' } = req.query;

  const token = Math.random().toString(36).substring(2, 10);
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  const tokens = loadTokens();

  tokens[token] = {
    book,
    format,
    label,
    page,
    expiresAt
  };

  saveTokens(tokens);

  console.log("TOKEN CREATED:", token);

  res.send({ token });
});

// ===============================
// 📥 DOWNLOAD ROUTE
// ===============================
app.get('/download', (req, res) => {
  const { token } = req.query;

  const tokens = loadTokens();
  const tokenData = tokens[token];

  if (!tokenData) {
    return res.status(403).send('Invalid or expired token.');
  }

  if (Date.now() > tokenData.expiresAt) {
    delete tokens[token];
    saveTokens(tokens);
    return res.status(403).send('Token expired.');
  }

  // 📊 log download
  const logPath = path.join(__dirname, 'public', 'downloads-data.js');

  const entry = {
    book: tokenData.book,
    format: tokenData.format,
    label: tokenData.label,
    page: tokenData.page,
    timestamp: Date.now(),
    ip: req.ip
  };

  const content =
    `window.downloadData = window.downloadData || [];\n` +
    `window.downloadData.push(${JSON.stringify(entry)});`;

  fs.appendFileSync(logPath, '\n' + content);

  // 📦 FILE MAP
  const fileMap = {
    'claimingher-pdf': 'Claiming Her.pdf',
    'claimingher-epub': 'Claiming Her.epub',

    'god-pdf': 'God Was Never the Problem.pdf',
    'god-epub': 'God Was Never the Problem.pdf',

    'what-pdf': 'What_It_Took_Print_Ready.pdf',
    'what-epub': 'What It Took.epub',
    'what-audio': 'What_It_Took.mp3',

    'paradox-pdf': 'The Paradox of Passion – Final Book.pdf',
    'paradox-epub': 'The Paradox of Passion.epub',
    'paradox-audio': 'The_Paradox_Of_Passion.mp3',

    'guts-pdf': 'This Is the Season for Guts.pdf',
    'guts-epub': 'This Is the Season for Guts.epub',

    'weapon-pdf': 'Woman. Weapon. Work .pdf',
    'weapon-epub': 'Woman. Weapon. Work .epub',

    'blackout-pdf': 'Blackout City – We Who Lived Below.pdf',
    'blackout-epub': 'BLACKOUT CITY: WE WHO LIVED BELOW.epub',

    'blackveinsopenmouths-pdf': 'Black Veins Open Mouths.pdf',
    'blackveinsopenmouths-epub': 'Black Veins Open Mouths.epub',

    'herhandsheldthefuture-pdf': 'Her Hands Held The Future.pdf',
    'herhandsheldthefuture-epub': 'Her Hands Held The Future.epub',

    'mothermonstermachine-pdf': 'Mother. Monster. Machine..pdf',
    'mothermonstermachine-epub': 'Mother. Monster. Machine..epub',

    'nothingstayshidden-pdf': 'Nothing Stays Hidden.pdf',
    'nothingstayshidden-epub': 'Nothing Stays Hidden.epub',

    'beautifuldisciplineofboredom-pdf': 'The Beautiful Discipline of Boredom.pdf',
    'beautifuldisciplineofboredom-epub': 'The Beautiful Discipline of Boredom.epub',

    'thisishowsheendedtheworld-pdf': 'This Is How She Ended The World.pdf',
    'thisishowsheendedtheworld-epub': 'This Is How She Ended The World.epub',

    'thronesbuiltonsand-pdf': 'Thrones Built On Sand.pdf',
    'thronesbuiltonsand-epub': 'Thrones Built On Sand.epub',

    'tostandinthefire-pdf': 'To Stand In the Fire.pdf',
    'tostandinthefire-epub': 'To Stand In the Fire.epub',
  };

  const format = (tokenData.format || '').toLowerCase();
  const book = (tokenData.book || '').toLowerCase();

  const key = `${book}-${format}`;
  const fileName = fileMap[key];

  if (!fileName) {
    console.log("❌ FILE NOT FOUND KEY:", key);
    return res.status(404).send('File not found.');
  }

  const filePath = path.join(__dirname, 'public', fileName);

  return res.download(filePath, fileName, (err) => {
    if (err) {
      console.log("❌ DOWNLOAD ERROR:", err.message);
      return res.status(500).send("Download failed");
    }
  });
});

// ===============================
// 📊 TRACKING
// ===============================
app.get('/api/tracking', (req, res) => {
  const logPath = path.join(__dirname, 'public', 'downloads-data.js');
  if (!fs.existsSync(logPath)) return res.json([]);

  const raw = fs.readFileSync(logPath, 'utf8');
  const matches = [...raw.matchAll(/downloadData\.push\((.*?)\);/g)];
  const entries = matches.map(m => JSON.parse(m[1]));

  res.json(entries);
});

// ===============================
// 🎯 PING
// ===============================
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ===============================
// 🚀 START SERVER
// ===============================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
