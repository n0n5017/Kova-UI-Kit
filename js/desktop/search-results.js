let searchProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initSearch();
  executeSearch();
});

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem("kova_cart") || "[]");
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  badge.innerText = count;
}

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

function triggerSuggestion(query) {
  window.location.href = `03-search-results.html?q=${encodeURIComponent(query)}`;
}

async function executeSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  const titleEl = document.getElementById("search-title");
  const queryInput = document.getElementById("search-input");
  const countTextEl = document.getElementById("search-count-text");
  const grid = document.getElementById("search-grid");

  if (queryInput) queryInput.value = query;

  if (!query.trim()) {
    if (titleEl) titleEl.innerText = 'Results for ""';
    if (countTextEl) countTextEl.innerText = "0 products matched.";
    if (grid)
      grid.innerHTML = "<p>Please enter a keyword in the search bar above.</p>";
    return;
  }

  if (titleEl) titleEl.innerText = `Results for "${query}"`;

  try {
    let res = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
    );
    let data = await res.json();
    searchProducts = data.products || [];

    // Fallback: If search endpoint yields empty or fails, query all products and filter locally
    if (searchProducts.length === 0) {
      const fallbackRes = await fetch(
        "https://dummyjson.com/products?limit=100",
      );
      const fallbackData = await fallbackRes.json();
      const lowerQuery = query.toLowerCase();
      searchProducts = (fallbackData.products || []).filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery),
      );
    }

    if (countTextEl) {
      countTextEl.innerText = `${searchProducts.length} ${searchProducts.length === 1 ? "product" : "products"} matched.`;
    }

    renderGrid(searchProducts);
  } catch (err) {
    // Secondary fallback on network failure
    try {
      const fallbackRes = await fetch(
        "https://dummyjson.com/products?limit=100",
      );
      const fallbackData = await fallbackRes.json();
      const lowerQuery = query.toLowerCase();
      searchProducts = (fallbackData.products || []).filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery),
      );
      if (countTextEl)
        countTextEl.innerText = `${searchProducts.length} products matched.`;
      renderGrid(searchProducts);
    } catch (e) {
      if (grid)
        grid.innerHTML = "<p>Unable to connect to the product database.</p>";
    }
  }
}

function renderGrid(products) {
  const grid = document.getElementById("search-grid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = "<p>No products found matching your search term.</p>";
    return;
  }

  grid.innerHTML = products
    .map((item, index) => {
      const bgClass = `bg-tint-${index % 4}`;
      const originalPrice = item.discountPercentage
        ? (item.price / (1 - item.discountPercentage / 100)).toFixed(2)
        : item.price.toFixed(2);

      const isLowStock = item.stock <= 5;
      const stockText = isLowStock
        ? `&bull; Low stock &middot; ${item.stock} left`
        : "&bull; In stock";

      return `
      <a href="04-product-detail.html?id=${item.id}" class="product-card">
        <div class="card-img-wrap ${bgClass}">
          ${item.discountPercentage > 0 ? `<span class="discount-tag">-${Math.round(item.discountPercentage)}%</span>` : ""}
          <img src="${item.thumbnail}" alt="${item.title}">
          <button class="wishlist-btn" onclick="event.preventDefault();">&#9825;</button>
        </div>
        <div class="product-category-tag">${item.category}</div>
        <div class="product-title">${item.title}</div>
        <div class="product-card-rating">&#9733;&#9733;&#9733;&#9733;&#9733; <span>${item.rating}</span></div>
        <div class="product-card-price-row">
          <span class="product-card-price">$${item.price.toFixed(2)}</span>
          ${item.discountPercentage > 0 ? `<span class="card-old-price">$${originalPrice}</span>` : ""}
        </div>
        <div class="stock-status ${isLowStock ? "low-stock" : ""}">${stockText}</div>
      </a>
    `;
    })
    .join("");
}
