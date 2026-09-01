document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && searchInput.value.trim() !== "") {
        window.location.href = `03-search-results.html?q=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

  const categoryPills = document.querySelectorAll(".category-pill");
  categoryPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      categoryPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  const wishlistButtons = document.querySelectorAll(".wishlist-icon-btn");
  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");
    });
  });
});