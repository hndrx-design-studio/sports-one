<script>
  // Register plugin
gsap.registerPlugin(ScrollTrigger);

// Utility: generate a binary scramble string matching length of target
function makeBinaryScramble(len) {
  const out = [];
  for (let i = 0; i < len; i++) {
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

    // Seed each text node with a binary mask that keeps whitespace/punct stable
    const initials = originals.map((str) =>
      Array.from(str)
        .map((ch) => {
          if (/\s/.test(ch) || /[.,;:!?'"()\-\u2013\u2014]/.test(ch)) return ch;
          return Math.random() < 0.5 ? "0" : "1";
        })
        .join("")
    );

    textNodes.forEach((n, i) => (n.nodeValue = initials[i]));

    // GSAP timeline per element with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%", // when element enters viewport
        once: true, // run only once
      },
      defaults: { duration: 2, ease: "none" },
    });

    // Animate a proxy object's progress 0->1 and render each tick
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
        // Ensure final text is exact, restore each node individually
        textNodes.forEach((n, i) => (n.nodeValue = originals[i]));
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
</script>
