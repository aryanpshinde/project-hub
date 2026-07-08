document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.bg-neo-success[role="alert"]');

  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease';
      alert.style.opacity = '0';

      setTimeout(() => alert.remove(), 500);
    }, 3000);
  });
});