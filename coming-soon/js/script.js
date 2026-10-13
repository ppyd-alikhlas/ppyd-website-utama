(() => {
  "use strict";

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // Open external social links in a separate tab without giving the new page
  // access to this page's window.
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });
})();
