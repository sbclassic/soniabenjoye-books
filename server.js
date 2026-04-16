console.log("🔥 SERVER FILE IS RUNNING");

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

const SECRET = "sb-book-secret-key-change-this";

// 🔒 ONE-TIME DOWNLOAD TRACKER (Option A)
const usedTokens = new Set();

// ===============================
// CORS
// ===============================
app.use(cors({
  origin: 'https://sbclassic.github.io'
}));

// ===============================
// STATIC FILES
// ===============================
app.use(express.static('public'));

// ===============================
// 🧪 TEST ROUTE
// ===============================
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ===============================
// 🔑 GENERATE SECURE LINK
// ===============================
app.get('/generate-token', (req, res) => {
  const { book, format } = req.query;

  if (!book || !format) {
    return res.status(400).send("Missing book or format");
  }

  const ts = Date.now();
  const payload = `${book}|${format}|${ts}`;

  const sig = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');

  res.json({
    ts,
    sig
  });
});

// ===============================
// 📥 DOWNLOAD ROUTE (OPTION A PROTECTED)
// ===============================
app.get('/download', (req, res) => {
  const { book, format, ts, sig } = req.query;

  if (!book || !format || !ts || !sig) {
    return res.status(403).send("Missing parameters.");
  }

  const payload = `${book}|${format}|${ts}`;

  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');

  if (expectedSig !== sig) {
    return res.status(403).send("Invalid or expired link.");
  }

  // ⏱ expiry (5 minutes)
  if (Date.now() - Number(ts) > 5 * 60 * 1000) {
    return res.status(403).send("Link expired.");
  }

  // 🔥 ONE-TIME USE CHECK
  const tokenId = `${book}-${format}-${ts}`;

  if (usedTokens.has(tokenId)) {
    return res.status(403).send("This download link has already been used.");
  }

  usedTokens.add(tokenId);

  const fileMap = {
    'claimingher-pdf': 'Claiming Her.pdf',
    'claimingher-epub': 'Claiming Her.epub',

    'god-pdf': 'God Was Never the Problem.pdf',
    'god-epub': 'God Was Never the Problem.pdf',

    'what-pdf': 'What_It_Took_Print_Ready.pdf',
    'what-epub': 'What It Took.epub',

    'paradox-pdf': 'The Paradox of Passion – Final Book.pdf',
    'paradox-epub': 'The Paradox of Passion.epub',

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

  const key = `${book.toLowerCase()}-${format.toLowerCase()}`;
  const fileName = fileMap[key];

  if (!fileName) {
    return res.status(404).send("File not found.");
  }

  const filePath = path.join(__dirname, 'public', fileName);

  return res.download(filePath, fileName, (err) => {
    if (err) {
      console.log("Download error:", err.message);
      return res.status(500).send("Download failed.");
    }
  });
});

// ===============================
// 📊 TRACKING
// ===============================
app.get('/api/tracking', (req, res) => {
  const logPath = path.join(__dirname, 'public', 'downloads-data.js');

  if (!fs.existsSync(logPath)) {
    return res.json([]);
  }

  const raw = fs.readFileSync(logPath, 'utf8');
  const matches = [...raw.matchAll(/downloadData\.push\((.*?)\);/g)];
  const entries = matches.map(m => JSON.parse(m[1]));

  res.json(entries);
});

// ===============================
// 🚀 START SERVER
// ===============================
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
