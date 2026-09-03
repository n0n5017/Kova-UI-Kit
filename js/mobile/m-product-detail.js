document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product-detail-container");
  const footerTotalPrice = document.getElementById("footer-total-price");
  const qtyEl = document.getElementById("product-qty");
  const decreaseBtn = document.getElementById("decrease-qty");
  const increaseBtn = document.getElementById("increase-qty");

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || 1;

  let currentQuantity = 1;
  let productPrice = 0;

  function updateTotalPrice() {
    if (footerTotalPrice) {
      footerTotalPrice.textContent = (productPrice * currentQuantity).toFixed(
        2,
      );
    }
    if (qtyEl) {
      qtyEl.textContent = currentQuantity;
    }
  }

  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const product = await response.json();

    if (!response.ok) {
      container.innerHTML = `<p>Product not found.</p>`;
      return;
    }

    productPrice = product.price;
    updateTotalPrice();

    const discountPercentage = product.discountPercentage
      ? Math.round(product.discountPercentage)
      : 7;
    const discountHtml = `<span class="discount-badge-absolute">-${discountPercentage}% TODAY</span>`;

    const oldPriceHtml = `<span class="old-price-strike">$${(product.price * 1.2).toFixed(2)}</span>`;

    const stockClass = product.stock < 20 ? "low" : "ok";
    const stockText =
      product.stock < 20
        ? `Low stock - ${product.stock} left`
        : `In stock (${product.stock} units)`;

    let reviewsHtml = "";
    if (product.reviews && product.reviews.length > 0) {
      reviewsHtml = product.reviews
        .map((r) => {
          const initials = r.reviewerName
            ? r.reviewerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
            : "U";
          return `
          <div class="review-card-item">
            <div class="review-top-row">
              <div class="reviewer-profile">
                <div class="reviewer-avatar">${initials}</div>
                <div class="reviewer-name-date">
                  <span class="review-name">${r.reviewerName}</span>
                  <span class="review-date-sub">${new Date(r.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div class="review-stars">★★★★★</div>
            </div>
            <p class="review-comment">${r.comment}</p>
          </div>
        `;
        })
        .join("");
    } else {
      reviewsHtml = `
        <div class="review-card-item">
          <div class="review-top-row">
            <div class="reviewer-profile">
              <div class="reviewer-avatar">JD</div>
              <div class="reviewer-name-date">
                <span class="review-name">John Doe</span>
                <span class="review-date-sub">23 May 2024</span>
              </div>
            </div>
            <div class="review-stars">★★★★★</div>
          </div>
          <p class="review-comment">Very unhappy with my purchase!</p>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="detail-gallery">
        ${discountHtml}
        <img src="${product.thumbnail}" alt="${product.title}">
      </div>
      <div class="detail-meta-row">
        <span class="detail-category">${product.category ? product.category.toUpperCase() : "BEAUTY"}</span>
      </div>
      <h1 class="detail-title">${product.title}</h1>
      <div class="detail-rating-row">
        <span>★★★★★</span>
        <span class="rating-num">${product.rating}</span>
        <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${product.reviews ? product.reviews.length : 3} reviews</span>
      </div>
      <div class="detail-price-box">
        <span class="current-price">$${product.price}</span>
        ${oldPriceHtml}
      </div>
      <p class="detail-description">${product.description}</p>
      
      <div class="stock-status-box ${stockClass}">
        <span>${stockText}</span>
      </div>

      <div class="detail-features">
        <div class="feature-row"><span>📦</span> <span>Ships in ${product.shippingInformation || "1 month"}</span></div>
        <div class="feature-row"><span>🛡️</span> <span>${product.warrantyInformation || "1 week warranty"}</span></div>
        <div class="feature-row"><span>🔄</span> <span>${product.returnPolicy || "30 days return policy"}</span></div>
      </div>

      <div class="reviews-section">
        <h3>Reviews</h3>
        ${reviewsHtml}
      </div>
    `;

    decreaseBtn.addEventListener("click", () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        updateTotalPrice();
      }
    });

    increaseBtn.addEventListener("click", () => {
      currentQuantity++;
      updateTotalPrice();
    });
  } catch (error) {
    console.error("Failed to load mobile product details:", error);
    container.innerHTML = `<p>Error loading product details. Check your connection.</p>`;
  }
});
