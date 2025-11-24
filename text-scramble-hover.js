function initHoverScramble() {
  const containers = document.querySelectorAll(
    '[hndrx-gsap="text-scramble-hover"]'
  );

  containers.forEach((container) => {
    if (container._hoverScrambleInit) return;
    container._hoverScrambleInit = true;

    // Target the new attribute name
    const textEl = container.querySelector(
      '[hndrx-gsap="text-scramble-on-hover"]'
    );
    if (!textEl) return;

    // Store original text on container
    if (!container.dataset.originalText) {
      container.dataset.originalText = textEl.textContent;
    }

    const originalText = container.dataset.originalText;
    const originalArr = originalText.split("");

    const proxy = { p: 0 };
    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        textEl.textContent = originalText;
      },
    });

    tl.to(proxy, {
      duration: 2,
      p: 1,
      ease: "power2.out",
      onUpdate: () => {
        const revealLength = Math.floor(originalArr.length * proxy.p);

        const result = originalArr
          .map((char, i) => {
            if (i < revealLength) return char;
            if (/[\s.,;:!?'"()\-–—]/.test(char)) return char;
            return Math.random() < 0.5 ? "0" : "1";
          })
          .join("");

        textEl.textContent = result;
      },
      onComplete: () => {
        textEl.textContent = originalText;
      },
    });

    container.addEventListener("mouseenter", () => {
      tl.restart();
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHoverScramble);
} else {
  initHoverScramble();
}
