let currentProduct = null;
let currentQuantity = 1;

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initSearch();
  loadProductDetail();
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

async function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "1";

  try {
    const res = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!res.ok) throw new Error("Product not found");
    currentProduct = await res.json();

    document.getElementById("p-title-breadcrumb").innerText =
      currentProduct.title;
    const catLink = document.getElementById("p-category-link");
    catLink.innerText =
      currentProduct.category.charAt(0).toUpperCase() +
      currentProduct.category.slice(1);
    catLink.href = `02-product-listing.html?category=${encodeURIComponent(currentProduct.category)}`;

    renderDetailView(currentProduct);
    renderReviews(currentProduct.reviews || []);
    loadRelatedProducts(currentProduct.category, currentProduct.id);
  } catch (err) {
    document.getElementById("detail-container").innerHTML =
      "<p>Unable to load product information.</p>";
  }
}

function renderDetailView(p) {
  const container = document.getElementById("detail-container");
  if (!container) return;

  const originalPrice = p.discountPercentage
    ? (p.price / (1 - p.discountPercentage / 100)).toFixed(2)
    : p.price.toFixed(2);

  const images = p.images && p.images.length ? p.images : [p.thumbnail];

  container.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-gallery">
        <div class="main-image-box bg-tint-0">
          <img id="main-product-img" src="${p.thumbnail}" alt="${p.title}">
        </div>
        <div class="gallery-thumbs">
          ${images
            .map(
              (img, idx) => `
            <img src="${img}" class="thumb-img ${idx === 0 ? "active" : ""}" onclick="switchImage('${img}', this)" alt="Thumbnail">
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="product-info-col">
        <h1 class="detail-title">${p.title}</h1>
        
        <div class="detail-rating">
          &#9733;&#9733;&#9733;&#9733;&#9733; <span>${p.rating} &middot; (${p.reviews ? p.reviews.length : 12} reviews)</span>
        </div>

        <div class="detail-price-row">
          <span class="detail-price">$${p.price.toFixed(2)}</span>
          ${p.discountPercentage > 0 ? `<span class="detail-discount-pill">-${Math.round(p.discountPercentage)}%</span>` : ""}
        </div>

        <p class="detail-description">${p.description}</p>

        <div class="purchase-box">
          <div class="qty-label-bar">
            <span>Minimum order quantity: 12 units</span>
          </div>
          <div class="purchase-controls">
            <div class="quantity-selector">
              <button onclick="changeQty(-1)">-</button>
              <span id="qty-display">1</span>
              <button onclick="changeQty(1)">+</button>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart()">Add to cart &bull; $${p.price.toFixed(2)}</button>
          </div>
          <button class="buy-now-btn" onclick="buyNow()">Buy it now</button>
        </div>

        <div class="feature-badges-row">
          <div class="f-badge"><span>&#128260;</span> 30-day returns</div>
          <div class="f-badge"><span>&#128666;</span> Free shipping</div>
          <div class="f-badge"><span>&#128274;</span> In-stock items</div>
        </div>

        <div class="specs-block">
          <h3>Specifications</h3>
          <table class="specs-table">
            <tr><td>Brand</td><td>${p.brand || "N/A"}</td></tr>
            <tr><td>Weight</td><td>${p.weight || "300"} g</td></tr>
            <tr><td>Dimensions</td><td>${p.dimensions ? `${p.dimensions.width} x ${p.dimensions.height} x ${p.dimensions.depth} cm` : "N/A"}</td></tr>
            <tr><td>Warranty</td><td>${p.warrantyInformation || "1 year warranty"}</td></tr>
            <tr><td>Shipping</td><td>${p.shippingInformation || "Ships in 1-2 business days"}</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;
}

function switchImage(src, el) {
  document.getElementById("main-product-img").src = src;
  document
    .querySelectorAll(".thumb-img")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
}

function changeQty(delta) {
  currentQuantity = Math.max(1, currentQuantity + delta);
  const display = document.getElementById("qty-display");
  if (display) display.innerText = currentQuantity;
}

function addToCart() {
  if (!currentProduct) return;

  const cart = JSON.parse(localStorage.getItem("kova_cart") || "[]");
  const existingIndex = cart.findIndex((item) => item.id === currentProduct.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += currentQuantity;
  } else {
    cart.push({
      id: currentProduct.id,
      title: currentProduct.title,
      price: currentProduct.price,
      thumbnail: currentProduct.thumbnail,
      category: currentProduct.category,
      quantity: currentQuantity,
    });
  }

  localStorage.setItem("kova_cart", JSON.stringify(cart));
  updateCartBadge();
}

function buyNow() {
  addToCart();
  window.location.href = "05-cart.html";
}

function renderReviews(reviews) {
  const grid = document.getElementById("reviews-grid");
  if (!grid) return;

  if (!reviews.length) {
    grid.innerHTML = "<p>No customer reviews yet.</p>";
    return;
  }

  grid.innerHTML = reviews
    .map(
      (r) => `
    <div class="review-card">
      <div class="review-user">${r.reviewerName}</div>
      <div class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p class="review-comment">"${r.comment}"</p>
    </div>
  `,
    )
    .join("");
}

async function loadRelatedProducts(category, currentId) {
  const grid = document.getElementById("related-grid");
  if (!grid) return;

  try {
    const res = await fetch(
      `https://dummyjson.com/products/category/${encodeURIComponent(category)}`,
    );
    const data = await res.json();
    const related = (data.products || [])
      .filter((item) => item.id !== currentId)
      .slice(0, 4);

    grid.innerHTML = related
      .map((item, index) => {
        const bgClass = `bg-tint-${index % 4}`;
        return `
        <a href="04-product-detail.html?id=${item.id}" class="product-card">
          <div class="card-img-wrap ${bgClass}">
            <img src="${item.thumbnail}" alt="${item.title}">
          </div>
          <div class="product-category-tag">${item.category}</div>
          <div class="product-title">${item.title}</div>
          <div class="product-card-rating">&#9733;&#9733;&#9733;&#9733;&#9733; <span>${item.rating}</span></div>
          <div class="product-card-price-row">
            <span class="product-card-price">$${item.price.toFixed(2)}</span>
          </div>
        </a>
      `;
      })
      .join("");
  } catch (err) {}
}
