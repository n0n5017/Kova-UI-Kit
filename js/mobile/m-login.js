document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const passwordGroup = passwordInput.closest(".input-group");
  const errorMsg = document.getElementById("error-msg");

  togglePasswordBtn.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    passwordGroup.classList.remove("error");
    errorMsg.style.display = "none";

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          expiresInMins: 30,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        passwordGroup.classList.add("error");
        errorMsg.textContent =
          data.message || "A Username or password is incorrect.";
        errorMsg.style.display = "block";
        return;
      }

      localStorage.setItem("kova_user", JSON.stringify(data));
      window.location.href = "01-home.html";
    } catch (err) {
      console.error("Login failed", err);
      passwordGroup.classList.add("error");
      errorMsg.textContent = "Network error. Please try again.";
      errorMsg.style.display = "block";
    }
  });
});
