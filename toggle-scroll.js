const btn = document.getElementById("toggleScrollBtn");
let scrollDisabled = false;

// Toggle scroll on button click
btn.addEventListener("click", () => {
  scrollDisabled = !scrollDisabled;

  if (scrollDisabled) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

// Restrict clicks only when scroll is disabled
document.addEventListener(
  "click",
  function (event) {
    if (!scrollDisabled) return; // only apply restriction when scroll is disabled

    const allowed = event.target.closest(
      ".navbar_logo-link, .navbar_menu-button, .navbar_link, .navbar2_mobile-button"
    );

    if (!allowed) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  },
  true // capture phase
);
