<!-- Paystack Integration -->
<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
  function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("open");
  }

  function payParadox() {
    fetch("https://sb-bookstore.onrender.com/generate-token?book=paradox&format=pdf")
      .then(res => res.json())
      .then(data => {
        var handler = PaystackPop.setup({
          key: 'pk_live_a09356e2ab5cf6afa40e5ea77de1d06ac4f86f99',
          email: 'benjoye21@gmail.com',
          amount: 4900,
          currency: "GHS",
          callback: function(response){
            window.location.href = "https://sb-bookstore.onrender.com/secure/" + data.token;
          },
          onClose: function(){
            alert('Transaction was not completed.');
          }
        });
        handler.openIframe();
      });
  }

  function payWhatItTook() {
    fetch("https://sb-bookstore.onrender.com/generate-token?book=whatitook&format=pdf")
      .then(res => res.json())
      .then(data => {
        var handler = PaystackPop.setup({
          key: 'pk_live_a09356e2ab5cf6afa40e5ea77de1d06ac4f86f99',
          email: 'benjoye21@gmail.com',
          amount: 6000,
          currency: "GHS",
          callback: function(response){
            window.location.href = "https://sb-bookstore.onrender.com/secure/" + data.token;
          },
          onClose: function(){
            alert('Transaction was not completed.');
          }
        });
        handler.openIframe();
      });
  }
</script>