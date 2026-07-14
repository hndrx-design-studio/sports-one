// Register plugin
gsap.registerPlugin(ScrollTrigger);

function scrambleFrame(fromArr, toArr, progress) {
  // Reveal left-to-right based on progress
  const revealCount = Math.floor(toArr.length * progress);
  const result = new Array(toArr.length);
  for (let i = 0; i < toArr.length; i++) {
    const targetChar = toArr[i];
    const isWhitespace = /\s/.test(targetChar);
    const isPunct = /[.,;:!?'"()\-\u2013\u2014]/.test(targetChar);
    if (i < revealCount) {
      result[i] = targetChar;
    } else if (isWhitespace || isPunct) {
      result[i] = targetChar;
    } else {
      result[i] = Math.random() < 0.5 ? "0" : "1";
    }
  }
  return result.join("");
}

// Walk the element and collect only its text nodes,
// leaving every wrapping tag (h2, strong, span, etc.) untouched
function getTextNodes(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    if (n.nodeValue.trim().length > 0) nodes.push(n);
  }
  return nodes;
}

function initTextScramble() {
  const els = document.querySelectorAll('[hndrx-gsap="text-scramble"]');
  els.forEach((el) => {
    const textNodes = getTextNodes(el);
    if (!textNodes.length) return;
    const originals = textNodes.map((n) => n.nodeValue);
    const initials = originals.map((str) =>
      Array.from(str)
        .map((ch) => {
          if (/\s/.test(ch) || /[.,;:!?'"()\-\u2013\u2014]/.test(ch)) return ch;
          return Math.random() < 0.5 ? "0" : "1";
        })
        .join("")
    );
    textNodes.forEach((n, i) => (n.nodeValue = initials[i]));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
      defaults: { duration: 1.8, ease: "none" },
    });

    const proxy = { p: 0 };
    tl.to(proxy, {
      p: 1,
      onUpdate: () => {
        textNodes.forEach((n, i) => {
          n.nodeValue = scrambleFrame(
            initials[i].split(""),
            Array.from(originals[i]),
            proxy.p
          );
        });
      },
      onComplete: () => {
        textNodes.forEach((n, i) => (n.nodeValue = originals[i]));
      },
    });
  });
}

function initTextScrambleFast() {
  const els = document.querySelectorAll('[hndrx-gsap="text-scramble-fast"]');
  els.forEach((el) => {
    const textNodes = getTextNodes(el);
    if (!textNodes.length) return;
    const originals = textNodes.map((n) => n.nodeValue);
    const initials = originals.map((str) =>
      Array.from(str)
        .map((ch) => {
          if (/\s/.test(ch) || /[.,;:!?'"()\-\u2013\u2014]/.test(ch)) return ch;
          return Math.random() < 0.5 ? "0" : "1";
        })
        .join("")
    );
    textNodes.forEach((n, i) => (n.nodeValue = initials[i]));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
      defaults: { duration: 1.2, ease: "none" },
    });

    const proxy = { p: 0 };
    tl.to(proxy, {
      p: 1,
      onUpdate: () => {
        textNodes.forEach((n, i) => {
          n.nodeValue = scrambleFrame(
            initials[i].split(""),
            Array.from(originals[i]),
            proxy.p
          );
        });
      },
      onComplete: () => {
        textNodes.forEach((n, i) => (n.nodeValue = originals[i]));
      },
    });
  });
}

// Init on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTextScramble();
    initTextScrambleFast();
  });
} else {
  initTextScramble();
  initTextScrambleFast();
}
