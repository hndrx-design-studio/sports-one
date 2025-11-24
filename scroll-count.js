document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("scroll-count");

  const updateNumber = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;

    const value = Math.round(100 - progress * 100);
    el.textContent = value;
  };

  updateNumber();
  window.addEventListener("scroll", updateNumber, { passive: true });
});
