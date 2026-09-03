document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initSearch();
  fetchFeaturedProduct();
  fetchCategories();
  fetchProducts();
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

async function fetchFeaturedProduct() {
  try {
    const res = await fetch("https://dummyjson.com/products/111");
    if (!res.ok) return;
    const item = await res.json();

    const img = document.getElementById("featured-img");
    const title = document.getElementById("featured-title");
    const price = document.getElementById("featured-price");
    const oldPrice = document.getElementById("featured-old-price");
    const category = document.getElementById("featured-category");
    const rating = document.getElementById("featured-rating");

    if (img) img.src = item.thumbnail;
    if (title) title.innerText = item.title;
    if (price) price.innerText = `$${item.price.toFixed(2)}`;
    if (category)
      category.innerText = item.category.replace("-", " ").toUpperCase();
    if (rating)
      rating.innerHTML = `${item.rating} &middot; ${item.reviews ? item.reviews.length : 3} reviews`;
    if (oldPrice && item.discountPercentage) {
      const original = item.price / (1 - item.discountPercentage / 100);
      oldPrice.innerText = `$${original.toFixed(2)}`;
    }
  } catch (err) {}
}

async function fetchCategories() {
  const container = document.getElementById("category-pills-container");
  if (!container) return;

  try {
    const res = await fetch("https://dummyjson.com/products/category-list");
    const categories = await res.json();

    container.innerHTML = categories
      .map(
        (cat, index) => `
      <a href="02-product-listing.html?category=${encodeURIComponent(cat)}" class="cat-pill ${index === 0 ? "active" : ""}">
        ${cat.replace("-", " ")}
      </a>
    `,
      )
      .join("");
  } catch (err) {}
}

async function fetchProducts() {
  const topRatedGrid = document.getElementById("top-rated-grid");
  const onSaleGrid = document.getElementById("on-sale-grid");

  try {
    const res = await fetch("https://dummyjson.com/products?limit=20");
    const data = await res.json();
    const products = data.products;

    if (topRatedGrid) {
      const topRated = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      renderGrid(topRatedGrid, topRated);
    }

    if (onSaleGrid) {
      const onSale = [...products]
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 4);
      renderGrid(onSaleGrid, onSale);
    }
  } catch (err) {}
}

function renderGrid(container, items) {
  container.innerHTML = items
    .map((item, index) => {
      const bgClass = `bg-tint-${index % 4}`;
      const originalPrice = (
        item.price /
        (1 - item.discountPercentage / 100)
      ).toFixed(2);
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
          <span class="card-old-price">$${originalPrice}</span>
        </div>
        <div class="stock-status ${isLowStock ? "low-stock" : ""}">${stockText}</div>
      </a>
    `;
    })
    .join("");
}
