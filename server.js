const TOKEN_FILE = path.join(__dirname, 'tokens.json');

function loadTokens() {
  if (!fs.existsSync(TOKEN_FILE)) return {};
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

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

  // 📊 logging download
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

  // 📦 file mapping
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
