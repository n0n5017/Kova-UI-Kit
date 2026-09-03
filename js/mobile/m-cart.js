document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("cart-items-container");
  const summarySection = document.getElementById("cart-summary-section");
  const stickyFooter = document.getElementById("cart-sticky-footer");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  let cartItems = JSON.parse(localStorage.getItem("kova_cart")) || [];

  if (cartItems.length === 0) {
    try {
      const res = await fetch("https://dummyjson.com/products/1");
      const product = await res.json();
      cartItems = [{ ...product, quantity: 1 }];
    } catch (e) {
      console.error("Failed to load default cart item", e);
    }
  }

  function renderCart() {
    if (cartItems.length === 0) {
      container.innerHTML = `<div class="empty-cart-msg">Your cart is empty.</div>`;
      summarySection.style.display = "none";
      stickyFooter.style.display = "none";
      return;
    }

    let subtotal = 0;
    container.innerHTML = cartItems
      .map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
        <div class="cart-item-card">
          <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <span class="cart-item-title">${item.title}</span>
            <span class="cart-item-price">$${item.price}</span>
            <div class="cart-item-controls">
              <div class="quantity-selector" style="transform: scale(0.85); transform-origin: left;">
                <button class="qty-btn decrease-item" data-index="${index}">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn increase-item" data-index="${index}">+</button>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
    summarySection.style.display = "flex";
    stickyFooter.style.display = "block";

    attachListeners();
  }

  function attachListeners() {
    document.querySelectorAll(".decrease-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        if (cartItems[idx].quantity > 1) {
          cartItems[idx].quantity--;
        } else {
          cartItems.splice(idx, 1);
        }
        localStorage.setItem("kova_cart", JSON.stringify(cartItems));
        renderCart();
      });
    });

    document.querySelectorAll(".increase-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        cartItems[idx].quantity++;
        localStorage.setItem("kova_cart", JSON.stringify(cartItems));
        renderCart();
      });
    });
  }

  renderCart();
});
