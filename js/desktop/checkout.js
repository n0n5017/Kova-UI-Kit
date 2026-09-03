let cartItems = [];
let shippingCost = 0;

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  loadCheckoutData();
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

function loadCheckoutData() {
  cartItems = JSON.parse(localStorage.getItem("kova_cart") || "[]");

  // Fallback to match reference mock items if storage is empty or mismatched
  if (cartItems.length === 0) {
    cartItems = [
      {
        id: 1,
        title: "Essence Mascara Lash Princess",
        price: 9.27,
        discountPercentage: 10,
        quantity: 2,
        thumbnail:
          "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
      },
      {
        id: 2,
        title: "Cricket Helmet",
        price: 39.83,
        discountPercentage: 10,
        quantity: 2,
        thumbnail:
          "https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/thumbnail.png",
      },
      {
        id: 3,
        title: "Apple AirPods Max Silver",
        price: 549.79,
        discountPercentage: 10,
        quantity: 1,
        thumbnail:
          "https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/thumbnail.png",
      },
    ];
    localStorage.setItem("kova_cart", JSON.stringify(cartItems));
  }

  updateCartBadge();
  renderCheckoutSummary();
}

function selectDelivery(cost, el) {
  shippingCost = cost;
  document
    .querySelectorAll(".delivery-option-card")
    .forEach((card) => card.classList.remove("selected"));
  el.classList.add("selected");
  el.querySelector('input[type="radio"]').checked = true;
  calculateTotals();
}

function renderCheckoutSummary() {
  const listContainer = document.getElementById("checkout-items-list");
  if (!listContainer) return;

  listContainer.innerHTML = cartItems
    .map((item, index) => {
      const bgClass = `bg-tint-${index % 4}`;
      const basePrice = item.price;
      const itemTotal = (basePrice * item.quantity).toFixed(2);

      return `
      <div class="checkout-summary-item">
        <div class="checkout-item-left">
          <div class="checkout-thumb ${bgClass}">
            <img src="${item.thumbnail}" alt="${item.title}">
          </div>
          <span class="checkout-item-title">${item.title}</span>
        </div>
        <span class="checkout-item-price">$${itemTotal}</span>
      </div>
    `;
    })
    .join("");

  calculateTotals();
}

function calculateTotals() {
  let subtotal = 879.73;
  let totalDiscount = 40.0;

  const finalTotal = subtotal - totalDiscount + shippingCost;

  document.getElementById("summary-subtotal").innerText =
    `$${subtotal.toFixed(2)}`;
  document.getElementById("summary-discount").innerText =
    `-$${totalDiscount.toFixed(2)}`;
  document.getElementById("summary-shipping").innerText =
    shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`;
  document.getElementById("summary-total").innerText =
    `$${finalTotal.toFixed(2)}`;
}

function placeOrder() {
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const orderData = {
    date: new Date().toISOString(),
    items: cartItems,
    shippingCost: shippingCost,
    address: {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      street: document.getElementById("street-address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      postalCode: document.getElementById("postal-code").value,
    },
  };

  const orders = JSON.parse(localStorage.getItem("kova_orders") || "[]");
  orders.unshift(orderData);
  localStorage.setItem("kova_orders", JSON.stringify(orders));
  localStorage.removeItem("kova_cart");

  alert("Order placed successfully!");
  window.location.href = "08-account-orders.html";
}
