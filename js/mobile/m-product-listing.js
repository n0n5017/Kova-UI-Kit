document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=10");
    const data = await response.json();
    const grid = document.getElementById("product-grid");

    if (!grid) return;
    grid.innerHTML = "";

    data.products.forEach((product, index) => {
      const discountHtml = product.discountPercentage
        ? `<span class="discount-badge">-${Math.round(product.discountPercentage)}%</span>`
        : "";
      const oldPriceHtml = product.discountPercentage
        ? `<span class="old-price">$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>`
        : "";
      const stockClass = product.stock < 10 ? "low" : "ok";
      const stockText =
        product.stock < 10 ? `Low stock - ${product.stock} left` : "In stock";

      const card = `
        <div class="product-card">
          <div class="card-top">
            ${discountHtml}
            <button class="fav-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
          <div class="product-img-box bg-tint-${index % 4}">
            <img src="${product.thumbnail}" alt="${product.title}">
          </div>
          <div class="product-info">
            <span class="product-category">${product.category.toUpperCase()}</span>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">★★★★★ <span class="rating-num">${product.rating}</span></div>
            <div class="product-price-row">
              <span class="price">$${product.price}</span>
              ${oldPriceHtml}
            </div>
            <div class="stock-status ${stockClass}">
              <span class="stock-dot"></span> ${stockText}
            </div>
          </div>
        </div>
      `;
      grid.insertAdjacentHTML("beforeend", card);
    });
  } catch (error) {
    console.error("Failed to load products for mobile listing:", error);
  }
});
