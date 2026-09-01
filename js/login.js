document.addEventListener('DOMContentLoaded', () => {
  const savedOrder = JSON.parse(localStorage.getItem('kova_last_order'));

  if (!savedOrder) return;

  const nameEl = document.getElementById('confirm-name');
  const addressEl = document.getElementById('confirm-address');
  const locationEl = document.getElementById('confirm-location');
  const subtitleEl = document.querySelector('.confirmation-subtitle');

  if (nameEl) nameEl.textContent = `${savedOrder.firstName} ${savedOrder.lastName}`;
  if (addressEl) addressEl.textContent = savedOrder.address;
  if (locationEl) locationEl.textContent = `${savedOrder.city}, ${savedOrder.zip}`;
  if (subtitleEl) {
    subtitleEl.textContent = `Order #${savedOrder.orderId} has been placed successfully. A confirmation email has been sent to your inbox.`;
  }
});