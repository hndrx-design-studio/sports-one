document.addEventListener("DOMContentLoaded", () => {
  // ---------- SCROLLING NUMBER ----------
  const numberEl = document.getElementById("scroll-count");
  const updateNumber = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const value = Math.max(0, Math.min(100, Math.round(100 - progress * 100)));
    if (numberEl) numberEl.textContent = String(value);
  };
  updateNumber();
  window.addEventListener("scroll", updateNumber, { passive: true });

  // ---------- NAV HIGHLIGHT ----------
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".navbar2_link")
  );
  var highlight = document.querySelector(".nav-highlight");
  if (!highlight || links.length === 0) return;

  function getTarget(link) {
    var sel = link.getAttribute("href") || "";
    if (!sel.startsWith("#") || sel === "#") return null;
    var el = document.querySelector(sel);
    return el || null;
  }

  var sections = links
    .map(function (link) {
      var target = getTarget(link);
      if (!target) return null;
      return {
        link: link,
        target: target,
        id: target.id,
        left: link.offsetLeft,
        width: link.offsetWidth,
        top: 0,
        bottom: 0,
        center: 0,
      };
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  function measureSections() {
    sections.forEach(function (s) {
      var rect = s.target.getBoundingClientRect();
      var pageTop = rect.top + window.scrollY;
      var height = rect.height;
      s.top = pageTop;
      s.bottom = pageTop + height;
      s.center = pageTop + height / 2;
    });
  }

  function positionHighlight(link) {
    if (!link) return;
    highlight.style.left = link.offsetLeft + "px";
    highlight.style.width = link.offsetWidth + "px";
  }

  function activateLink(link) {
    if (!link) return;
    // Only update active class here (on scroll), not on click
    links.forEach(function (l) {
      l.classList.remove("is-active");
    });
    link.classList.add("is-active");
    positionHighlight(link);
  }

  function showHighlight() {
    highlight.style.opacity = "1";
  }
  function hideHighlight() {
    highlight.style.opacity = "0";
  }

  var currentLinkedId = null;

  // Center-probe (always returns the closest linked section)
  function computeActiveByCenter() {
    var viewportCenter = window.scrollY + window.innerHeight / 2;
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      var dist = Math.abs(s.center - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
    return best;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      measureSections();
      var best = computeActiveByCenter();
      if (best) {
        currentLinkedId = best.id;
        activateLink(best.link); // moves bar and sets .is-active
        showHighlight();
      }
      ticking = false;
    });
  }

  // CLICK: do not change text color or move the bar
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var target = getTarget(link);
      if (!target) return;
      currentLinkedId = target.id;
      // No class changes, no bar movement. Scroll will handle it.
      showHighlight(); // keep visible if already shown
    });
  });

  // Initial
  highlight.style.transition =
    "left 0.3s ease, width 0.3s ease, opacity 0.2s ease";
  hideHighlight();

  function recalc() {
    sections.forEach(function (sec) {
      sec.left = sec.link.offsetLeft;
      sec.width = sec.link.offsetWidth;
    });
    measureSections();
    var currentLink =
      (currentLinkedId &&
        sections.find(function (s) {
          return s.id === currentLinkedId;
        })?.link) ||
      document.querySelector(".navbar2_link.is-active");
    if (currentLink) positionHighlight(currentLink);
  }

  // Staged recalcs to catch layout shifts
  recalc();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(recalc).catch(function () {});
  }
  setTimeout(recalc, 100);
  setTimeout(recalc, 300);
  setTimeout(recalc, 800);

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hash navigation: do not move the bar or change text on hash change
  window.addEventListener("hashchange", function () {
    var hash = location.hash;
    if (!hash) return;
    var link = links.find(function (l) {
      return l.getAttribute("href") === hash;
    });
    if (link) {
      var target = getTarget(link);
      if (target) {
        currentLinkedId = target.id;
        // No visual changes here; scroll will update when appropriate
        showHighlight();
        recalc();
      }
    }
  });
});
