<!-- ✨ SB – Secure Digital Bookstore -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SB – Digital Bookstore</title>

<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Playfair+Display&display=swap" rel="stylesheet">

<style>
body {
  margin: 0;
  font-family: 'Libre Baskerville', serif;
  background-color: #f9f7f6;
  color: #2b2b2b;
}

header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #ddd;
}

.menu-icon {
  font-size: 1.6rem;
  cursor: pointer;
  margin-right: 1rem;
}

.logo {
  flex: 1;
  text-align: center;
}

.logo img {
  max-width: 240px;
}

.overlay-menu {
  position: fixed;
  top: 0;
  left: -100%;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background: #fff;
  transition: 0.3s;
  padding: 2rem;
  z-index: 9999;
}

.overlay-menu.open {
  left: 0;
}

.overlay-menu a {
  display: block;
  margin: 1rem 0;
  font-weight: bold;
  color: #191970;
  text-decoration: none;
}

.section {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
}

.button {
  display: inline-block;
  background: #191970;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
</style>
</head>

<body>

<header>
  <div class="menu-icon" onclick="toggleMenu()">☰</div>
  <div class="logo">
    <img src="sb_digital_logo.PNG">
  </div>
</header>

<div class="overlay-menu" id="menu">
  <a href="index.html">Home</a>
  <a href="ebook.html">Ebook</a>
  <a href="audiobook.html">Audiobook</a>
</div>

<!-- ===================== -->
<!-- BOOKS -->
<!-- ===================== -->

<div class="section">
  <h2>Claiming Her</h2>
  <button class="button" onclick="buy('claimingher', 6000)">Buy Ebook</button>
</div>

<div class="section">
  <h2>God Was Never The Problem</h2>
  <button class="button" onclick="buy('god', 6000)">Buy Ebook</button>
</div>

<div class="section">
  <h2>The Paradox of Passion</h2>
  <button class="button" onclick="buy('paradox', 4900)">Buy Ebook</button>
  <button class="button" onclick="buy('paradox', 4900, 'audio')">Buy Audiobook</button>
</div>

<div class="section">
  <h2>What It Took</h2>
  <button class="button" onclick="buy('what', 6000)">Buy Ebook</button>
  <button class="button" onclick="buy('what', 6000, 'audio')">Buy Audiobook</button>
</div>

<div class="section">
  <h2>Mother Monster Machine</h2>
  <button class="button" onclick="buy('mothermonster', 6000)">Buy Ebook</button>
</div>

<div class="section">
  <h2>Blackout City</h2>
  <button class="button" onclick="buy('blackout', 6000)">Buy Ebook</button>
</div>

<footer style="text-align:center; padding:2rem;">
© 2025 SB Bookstore
</footer>

<script>
function toggleMenu(){
  document.getElementById("menu").classList.toggle("open");
}

/**
 * 🔥 FIXED FLOW (matches server.js)
 * Paystack → /paystack-success → server signs → download
 */
function buy(book, amount, format = "pdf") {

  const email = "benjoye21@gmail.com";

  const handler = PaystackPop.setup({
    key: "pk_live_a09356e2ab5cf6afa40e5ea77de1d06ac4f86f99",
    email,
    amount,
    currency: "GHS",

    callback: function () {
      // IMPORTANT: THIS NOW MATCHES YOUR SERVER.JS
      window.location.href =
        `https://sb-bookstore-backend.onrender.com/paystack-success?book=${book}&format=${format}`;
    },

    onClose: function () {
      alert("Payment not completed.");
    }
  });

  handler.openIframe();
}
</script>

<script src="https://js.paystack.co/v1/inline.js"></script>

</body>
</html>
