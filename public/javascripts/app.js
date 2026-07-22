document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("select[data-auto-submit]").forEach((select) => {
    select.addEventListener("change", () => {
      const form = select.closest("form");
      if (form) form.submit();
    });
  });

  document.querySelectorAll("form[data-confirm]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!confirm(form.dataset.confirm)) {
        e.preventDefault();
      }
    });
  });
});
