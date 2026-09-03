let cartItems = [];

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  loadCart();
});

function initSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      window.location.href = `03-search-results.html?q=${encodeURIComponent(query)}`;
    }
  });
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  badge.innerText = count;
}

function loadCart() {
  cartItems = JSON.parse(localStorage.getItem("kova_cart") || "[]");
  updateCartBadge();
  renderCart();
}

function saveCart() {
  localStorage.setItem("kova_cart", JSON.stringify(cartItems));
  updateCartBadge();
  renderCart();
}

function clearCart() {
  cartItems = [];
  saveCart();
}

function renderCart() {
  const container = document.getElementById("cart-items-container");
  const bottomActions = document.getElementById("cart-bottom-actions");
  const subtitle = document.getElementById("cart-count-subtitle");
  if (!container) return;

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  const totalProducts = cartItems.length;
  if (subtitle) {
    subtitle.innerText = `${totalProducts} products \u00b7 ${totalItems} items`;
  }

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-view">
        <p>Your shopping cart is empty.</p>
        <a href="02-product-listing.html" class="shop-now-btn">Start Shopping</a>
      </div>
    `;
    if (bottomActions) bottomActions.style.display = "none";
    updateSummary(0, 0);
    return;
  }

  if (bottomActions) bottomActions.style.display = "flex";

  container.innerHTML = cartItems
    .map((item, index) => {
      const bgClass = `bg-tint-${index % 4}`;
      const basePrice = item.price;
      const discountPct = item.discountPercentage || 10;
      const originalPrice = (basePrice / (1 - discountPct / 100)).toFixed(2);
      const itemTotal = (basePrice * item.quantity).toFixed(2);

      return `
      <div class="cart-item-card">
        <div class="cart-item-left-group">
          <div class="cart-item-img ${bgClass}">
            <img src="${item.thumbnail}" alt="${item.title}">
          </div>

          <div class="cart-item-details">
            <span class="cart-item-cat">${(item.category || "PRODUCT").toUpperCase()}</span>
            <a href="04-product-detail.html?id=${item.id}" class="cart-item-title">${item.title}</a>
            <div class="cart-item-price-row">
              <span class="cart-item-current-price">$${basePrice.toFixed(2)}</span>
              <span class="cart-item-old-price">$${originalPrice}</span>
              <span class="cart-item-discount-pill">-${Math.round(discountPct)}%</span>
            </div>
          </div>
        </div>

        <div class="cart-item-right-group">
          <span class="cart-item-total">$${itemTotal}</span>
          
          <div class="cart-item-controls-row">
            <div class="quantity-selector">
              <button onclick="updateQty(${index}, -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateQty(${index}, 1)">+</button>
            </div>
            <button class="remove-item-btn" onclick="removeItem(${index})" title="Remove item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  let subtotal = 0;
  let totalDiscount = 0;

  cartItems.forEach((item) => {
    const bp = item.price;
    const dp = item.discountPercentage || 10;
    const op = bp / (1 - dp / 100);
    subtotal += op * item.quantity;
    totalDiscount += (op - bp) * item.quantity;
  });

  updateSummary(subtotal, totalDiscount, totalItems);
}

function updateQty(index, delta) {
  if (cartItems[index]) {
    cartItems[index].quantity += delta;
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    }
    saveCart();
  }
}

function removeItem(index) {
  if (cartItems[index]) {
    cartItems.splice(index, 1);
    saveCart();
  }
}

function updateSummary(subtotal, discount, totalItems) {
  const subtotalEl = document.getElementById("summary-subtotal");
  const discountEl = document.getElementById("summary-discount");
  const totalEl = document.getElementById("summary-total");
  const itemsLabelEl = document.getElementById("summary-items-label");

  if (!subtotalEl || !discountEl || !totalEl) return;

  const finalTotal = subtotal - discount;

  if (itemsLabelEl)
    itemsLabelEl.innerText = `Subtotal (${totalItems || 0} items)`;
  subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  discountEl.innerText = `-$${discount.toFixed(2)}`;
  totalEl.innerText = `$${finalTotal.toFixed(2)}`;
}
