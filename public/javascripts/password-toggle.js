document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");
  const eyeOffIcon = document.getElementById("eye-off-icon");

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      if (eyeIcon && eyeOffIcon) {
        eyeIcon.classList.toggle("hidden");
        eyeOffIcon.classList.toggle("hidden");
      }
    });
  }
});
