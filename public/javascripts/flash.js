document.addEventListener("DOMContentLoaded", () => {
  const successAlerts = document.querySelectorAll(
    '.bg-neo-success[role="alert"]',
  );
  successAlerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = "opacity 0.5s ease";
      alert.style.opacity = "0";
      setTimeout(() => alert.remove(), 500);
    }, 3000);
  });

  const closeButtons = document.querySelectorAll('button[aria-label="Close"]');
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const alert = btn.closest('[role="alert"]');
      if (alert) {
        alert.style.transition = "opacity 0.5s ease";
        alert.style.opacity = "0";
        setTimeout(() => alert.remove(), 500);
      }
    });
  });
});
