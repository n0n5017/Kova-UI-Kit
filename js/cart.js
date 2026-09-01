document.addEventListener('DOMContentLoaded', () => {
  const cartRows = document.querySelectorAll('.cart-item');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  function recalculateCart() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(row => {
      const unitPrice = parseFloat(row.dataset.price);
      const qtyInput = row.querySelector('.qty-val');
      const qty = parseInt(qtyInput ? qtyInput.value : 1);
      const rowTotal = unitPrice * qty;
      
      const itemTotalEl = row.querySelector('.item-total-price');
      if (itemTotalEl) {
        itemTotalEl.textContent = `$${rowTotal.toFixed(2)}`;
      }
      total += rowTotal;
    });
    
    if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  cartRows.forEach(row => {
    const btnInc = row.querySelector('.btn-qty-inc');
    const btnDec = row.querySelector('.btn-qty-dec');
    const qtyInput = row.querySelector('.qty-val');
    const btnRemove = row.querySelector('.btn-remove');

    if (btnInc) {
      btnInc.addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
        recalculateCart();
      });
    }

    if (btnDec) {
      btnDec.addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 1) {
          qtyInput.value = parseInt(qtyInput.value) - 1;
          recalculateCart();
        }
      });
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', () => {
        row.remove();
        recalculateCart();
      });
    }
  });
});