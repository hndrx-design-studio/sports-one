// Register plugin
gsap.registerPlugin(ScrollTrigger);

// Utility: generate a binary scramble string matching length of target
function makeBinaryScramble(len) {
  // Keep whitespace the same to avoid layout shifts
  const out = [];
  for (let i = 0; i < len; i++) {
    // Placeholder for letter-like chars vs. whitespace
    out.push(Math.random() < 0.5 ? "0" : "1");
  }
  return out.join("");
}

function scrambleFrame(fromArr, toArr, progress) {
  // Reveal left-to-right based on progress
  const revealCount = Math.floor(toArr.length * progress);
  const result = new Array(toArr.length);

  for (let i = 0; i < toArr.length; i++) {
    const targetChar = toArr[i];

    // Preserve whitespace and punctuation immediately (optional: or reveal with index)
    const isWhitespace = /\s/.test(targetChar);
    const isPunct = /[.,;:!?'"()\-\u2013\u2014]/.test(targetChar);

    if (i < revealCount) {
      result[i] = targetChar;
    } else if (isWhitespace || isPunct) {
      // Keep these stable to avoid jitter
      result[i] = targetChar;
    } else {
      // Keep scrambling as binary
      result[i] = Math.random() < 0.5 ? "0" : "1";
    }
  }

  return result.join("");
}

function initTextScramble() {
  const nodes = document.querySelectorAll('[hndrx-gsap="text-scramble"]');

  nodes.forEach((el) => {
    const original = el.textContent || "";
    const toArr = Array.from(original);

    // Seed with binary mask that keeps whitespace/punct stable
    const initial = toArr
      .map((ch) => {
        if (/\s/.test(ch) || /[.,;:!?'"()\-\u2013\u2014]/.test(ch)) return ch;
        return Math.random() < 0.5 ? "0" : "1";
      })
      .join("");

    el.textContent = initial;

    // GSAP timeline per element with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%", // when element enters viewport
        once: true, // run only once
      },
      defaults: { duration: 2, ease: "none" },
    });

    // Animate a proxy object’s progress 0->1 and render each tick
    const proxy = { p: 0 };

    tl.to(proxy, {
      p: 1,
      onUpdate: () => {
        const next = scrambleFrame(initial.split(""), toArr, proxy.p);
        el.textContent = next;
      },
      onComplete: () => {
        // Ensure final text is exact
        el.textContent = original;
      },
    });
  });
}

// Init on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTextScramble);
} else {
  initTextScramble();
}
