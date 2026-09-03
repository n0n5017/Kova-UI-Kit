document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  loadUserOrders();
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

function signOut() {
  localStorage.removeItem("kova_user");
  window.location.href = "07-login.html";
}

function loadUserOrders() {
  const orders = JSON.parse(localStorage.getItem("kova_orders") || "[]");
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) return;

  if (orders.length > 0) {
    let rowsHtml = orders
      .map((order, index) => {
        const orderNum = `#${54 + index}`;
        const dateStr = new Date(order.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const itemCount = order.items.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0,
        );
        const subtotal = order.items.reduce(
          (sum, item) => sum + item.price * (item.quantity || 1),
          0,
        );
        const total = subtotal - 40 + (order.shippingCost || 0);

        return `
        <tr>
          <td>${orderNum}</td>
          <td>${dateStr}</td>
          <td>${itemCount} products</td>
          <td>$${total.toFixed(2)}</td>
          <td><span class="status-badge delivered">Delivered</span></td>
        </tr>
      `;
      })
      .join("");

    tbody.innerHTML = rowsHtml + tbody.innerHTML;
  }
}
