function togglePassword() {
  const passwordInput = document.getElementById("password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "emilys" && password === "emilyspass") {
    const userData = {
      username: username,
      firstName: "Emily",
      lastName: "Johnson",
    };
    localStorage.setItem("kova_user", JSON.stringify(userData));
    window.location.href = "01-home.html";
  } else {
    alert(
      "Invalid username or password. Use test credentials: emilys / emilyspass",
    );
  }
}
