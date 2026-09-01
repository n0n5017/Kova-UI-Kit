document.addEventListener("DOMContentLoaded", () => {
  const signOutBtn = document.querySelector(".btn-sign-out-outline");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      const confirmSignOut = confirm("Are you sure you want to sign out?");
      if (confirmSignOut) {
        window.location.href = "07-login.html";
      }
    });
  }

  const wishlistButtons = document.querySelectorAll(".wishlist-icon-btn");
  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");
      const isSaved = btn.classList.contains("active");
      if (!isSaved) {
        const productCard = btn.closest(".product-card");
        if (productCard) {
          productCard.style.opacity = "0.5";
          setTimeout(() => productCard.remove(), 300);
        }
      }
    });
  });

  const orderRows = document.querySelectorAll(".orders-table tbody tr");
  orderRows.forEach((row) => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      const cartId = row.querySelector("strong").textContent;
      alert(`Viewing details for cart ${cartId}`);
    });
  });
});