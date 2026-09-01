document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkout-form');
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById('card-details');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      cardDetails.style.display = e.target.value === 'paypal' ? 'none' : 'block';
    });
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const orderData = {
        orderId: 'KV-' + Math.floor(10000 + Math.random() * 90000),
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value === 'paypal' ? 'PayPal' : 'Credit Card',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      localStorage.setItem('kova_last_order', JSON.stringify(orderData));
      window.location.href = '07-order-confirmation.html';
    });
  }
});