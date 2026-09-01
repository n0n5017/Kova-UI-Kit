document.addEventListener('DOMContentLoaded', () => {
  const priceRange = document.getElementById('price-range');
  const priceVal = document.getElementById('price-val');

  if (priceRange && priceVal) {
    priceRange.addEventListener('input', (e) => {
      priceVal.textContent = e.target.value;
    });
  }
});