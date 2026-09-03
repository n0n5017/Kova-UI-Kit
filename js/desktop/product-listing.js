let allProducts = [];
let filteredProducts = [];
let activeCategory = "beauty";
let maxPrice = 1000;

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initSearch();
  parseQueryParams();
  loadCategories();
  loadProducts();

  document
    .getElementById("sort-select")
    ?.addEventListener("change", applyFiltersAndSort);
  document
    .getElementById("price-range")
    ?.addEventListener("input", handlePriceChange);
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

function parseQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get("category");
  if (cat) {
    activeCategory = cat.toLowerCase();
  }
}

function handlePriceChange(e) {
  maxPrice = parseFloat(e.target.value);
  const valEl = document.getElementById("price-range-value");
  if (valEl) valEl.innerText = `$${maxPrice.toLocaleString()}`;
  applyFiltersAndSort();
}

async function loadCategories() {
  const container = document.getElementById("category-filter-list");
  if (!container) return;

  try {
    const res = await fetch("https://dummyjson.com/products/category-list");
    const categories = await res.json();

    const linksHtml = categories
      .map((cat) => {
        const isSelected = cat.toLowerCase() === activeCategory;
        const displayName = cat.replace(/-/g, " ");
        return `
        <li>
          <a href="02-product-listing.html?category=${encodeURIComponent(cat)}" 
             class="${isSelected ? "active" : ""}">
            ${displayName}
          </a>
        </li>
      `;
      })
      .join("");

    container.innerHTML = `
      <li>
        <a href="02-product-listing.html?category=all" class="${activeCategory === "all" ? "active" : ""}">
          All Products
        </a>
      </li>
      ${linksHtml}
    `;
  } catch (err) {}
}

async function loadProducts() {
  const grid = document.getElementById("catalog-grid");
  const titleEl = document.getElementById("listing-title");
  const breadcrumbCat = document.getElementById("breadcrumb-category");

  const formattedCat =
    activeCategory === "all"
      ? "All Products"
      : activeCategory.replace(/-/g, " ");
  const capitalizedTitle =
    formattedCat.charAt(0).toUpperCase() + formattedCat.slice(1);

  if (titleEl) titleEl.innerText = capitalizedTitle;
  if (breadcrumbCat) breadcrumbCat.innerText = capitalizedTitle;

  let endpoint = "https://dummyjson.com/products?limit=100";
  if (activeCategory !== "all") {
    endpoint = `https://dummyjson.com/products/category/${encodeURIComponent(activeCategory)}`;
  }

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    allProducts = data.products || [];
    applyFiltersAndSort();
  } catch (err) {
    if (grid) grid.innerHTML = "<p>Failed to load products.</p>";
  }
}

function applyFiltersAndSort() {
  filteredProducts = allProducts.filter((item) => item.price <= maxPrice);

  const sortValue = document.getElementById("sort-select")?.value || "default";
  if (sortValue === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating-desc") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  renderPills();
  renderGrid(filteredProducts);
}

function renderPills() {
  const container = document.getElementById("active-pills-container");
  if (!container) return;

  const formattedCat = activeCategory.replace(/-/g, " ");
  const catName = formattedCat.charAt(0).toUpperCase() + formattedCat.slice(1);

  container.innerHTML = `
    <div class="pill-tag">${catName} <span>&#10005;</span></div>
    <div class="pill-tag">Less than $${maxPrice.toLocaleString()} <span>&#10005;</span></div>
  `;
}

function renderGrid(products) {
  const grid = document.getElementById("catalog-grid");
  const countEl = document.getElementById("product-count");
  const paginationInfo = document.getElementById("pagination-info");

  if (!grid) return;

  const totalCount = products.length;
  const countText = `Showing 1 - ${totalCount} of ${totalCount} products`;

  if (countEl) countEl.innerText = countText;
  if (paginationInfo) paginationInfo.innerText = countText;

  if (totalCount === 0) {
    grid.innerHTML = "<p>No products match your filters.</p>";
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
