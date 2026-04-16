app.get('/download', (req, res) => {
  const { token } = req.query;
  const tokenData = VALID_TOKENS.get(token);

  if (!tokenData) return res.status(403).send('Invalid or expired token.');
  if (Date.now() > tokenData.expiresAt) {
    VALID_TOKENS.delete(token);
    return res.status(403).send('Token expired.');
  }

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

  const fileMap = {
    // Claiming Her
    'claimingher-pdf': 'Claiming Her.pdf',
    'claimingher-epub': 'Claiming Her.epub',

    // God Was Never The Problem
    'god-pdf': 'God Was Never the Problem.pdf',
    'god-epub': 'God Was Never the Problem.pdf',

    // What It Took
    'what-pdf': 'What_It_Took_Print_Ready.pdf',
    'what-epub': 'What It Took.epub',
    'what-audio': 'What_It_Took.mp3',

    // The Paradox of Passion
    'paradox-pdf': 'The Paradox of Passion – Final Book.pdf',
    'paradox-epub': 'The Paradox of Passion.epub',
    'paradox-audio': 'The_Paradox_Of_Passion.mp3',

    // This Is the Season for Guts
    'guts-pdf': 'This Is the Season for Guts.pdf',
    'guts-epub': 'This Is the Season for Guts.epub',

    // Woman. Weapon. Work.
    'weapon-pdf': 'Woman. Weapon. Work .pdf',
    'weapon-epub': 'Woman. Weapon. Work .epub',

    // Blackout City
    'blackout-pdf': 'Blackout City – We Who Lived Below.pdf',
    'blackout-epub': 'BLACKOUT CITY: WE WHO LIVED BELOW.epub',

    // Black Veins Open Mouths
    'blackveinsopenmouths-pdf': 'Black Veins Open Mouths.pdf',
    'blackveinsopenmouths-epub': 'Black Veins Open Mouths.epub',

    // Her Hands Held The Future
    'herhandsheldthefuture-pdf': 'Her Hands Held The Future.pdf',
    'herhandsheldthefuture-epub': 'Her Hands Held The Future.epub',

    // Mother. Monster. Machine
    'mothermonstermachine-pdf': 'Mother. Monster. Machine..pdf',
    'mothermonstermachine-epub': 'Mother. Monster. Machine..epub',

    // Nothing Stays Hidden
    'nothingstayshidden-pdf': 'Nothing Stays Hidden.pdf',
    'nothingstayshidden-epub': 'Nothing Stays Hidden.epub',

    // The Beautiful Discipline of Boredom
    'beautifuldisciplineofboredom-pdf': 'The Beautiful Discipline of Boredom.pdf',
    'beautifuldisciplineofboredom-epub': 'The Beautiful Discipline of Boredom.epub',

    // This Is How She Ended The World
    'thisishowsheendedtheworld-pdf': 'This Is How She Ended The World.pdf',
    'thisishowsheendedtheworld-epub': 'This Is How She Ended The World.epub',

    // Thrones Built On Sand
    'thronesbuiltonsand-pdf': 'Thrones Built On Sand.pdf',
    'thronesbuiltonsand-epub': 'Thrones Built On Sand.epub',

    // To Stand In The Fire
    'tostandinthefire-pdf': 'To Stand In the Fire.pdf',
    'tostandinthefire-epub': 'To Stand In the Fire.epub',
  };

  // 🔥 FIX #1: normalize format (THIS WAS BREAKING EVERYTHING)
  const key = `${tokenData.book}-${tokenData.format.toLowerCase()}`;

  const fileName = fileMap[key];

  if (!fileName) {
    console.log("FILE NOT FOUND KEY:", key);
    return res.status(404).send('File not found.');
  }

  const filePath = path.join(__dirname, 'public', fileName);

  // 🔥 FIX #2: safer download with error handling
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.log("DOWNLOAD ERROR:", err.message);
    }
  });
});
