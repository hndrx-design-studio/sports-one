(function () {
  var MQ = window.matchMedia("(max-width: 767px)");

  var teardown = null; // holds a function to remove listeners and reset state

  function initMobileMenuController() {
    var btn = document.getElementById("toggleScrollBtn");
    var menu = document.querySelector(".navbar_menu");
    var lineTop = document.querySelector(".menu-button_line-top");
    var lineMid = document.querySelector(".menu-button_line-middle");
    var lineBot = document.querySelector(".menu-button_line-bottom");

    var ALLOWED_SELECTOR =
      ".navbar_logo-link, .navbar_menu-button, .navbar_link, .navbar2_mobile-button";

    if (!btn || !menu || !lineTop || !lineMid || !lineBot) {
      console.warn(
        "Missing one or more required elements: #toggleScrollBtn, .navbar_menu, .menu-button_line-*"
      );
      return function () {};
    }

    var isOpen = false;
    var isAnimating = false;

    var EASING = {
      linear: "linear",
      "in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",
    };

    function setStyle(el, styles) {
      for (var k in styles) {
        if (Object.prototype.hasOwnProperty.call(styles, k)) {
          el.style[k] = styles[k];
        }
      }
    }

    function wait(ms) {
      return new Promise(function (resolve) {
        setTimeout(resolve, ms);
      });
    }

    function setScrollLock(lock) {
      if (lock) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    function applyInitial() {
      setStyle(menu, {
        display: "none",
        transform: "translateY(-100%)",
        opacity: "0",
        transition: "none",
      });
      setStyle(lineTop, { transform: "translateX(0px)", transition: "none" });
      setStyle(lineMid, { transform: "translateX(0px)", transition: "none" });
      setStyle(lineBot, { transform: "translateX(0px)", transition: "none" });

      // performance hints
      setStyle(menu, { willChange: "transform, opacity" });
      setStyle(lineTop, { willChange: "transform" });
      setStyle(lineMid, { willChange: "transform" });
      setStyle(lineBot, { willChange: "transform" });
    }

    applyInitial();

    function clearTransitions() {
      lineTop.style.transition = "none";
      lineMid.style.transition = "none";
      lineBot.style.transition = "none";
      menu.style.transition = "none";
    }

    async function openMenu() {
      if (isOpen || isAnimating) return;
      isAnimating = true;

      clearTransitions();
      setStyle(menu, { display: "flex" });

      // force reflow
      void menu.offsetHeight;

      setStyle(menu, {
        transform: "translateY(0%)",
        transition: "opacity 0.5s " + EASING.linear + ", transform 0s",
        opacity: "1",
      });

      setStyle(lineTop, {
        transition: "transform 0.2s " + EASING["in-out-quart"],
        transform: "translateX(45px)",
      });
      setTimeout(function () {
        setStyle(lineMid, {
          transition: "transform 0.2s " + EASING["in-out-quart"],
          transform: "translateX(45px)",
        });
      }, 100);
      setTimeout(function () {
        setStyle(lineBot, {
          transition: "transform 0.2s " + EASING["in-out-quart"],
          transform: "translateX(45px)",
        });
      }, 200);

      await wait(400);

      clearTransitions();
      setStyle(lineTop, {
        transform: "translateX(45px) translateY(8px) rotate(-45deg)",
      });
      setStyle(lineBot, {
        transform: "translateX(45px) translateY(-8px) rotate(45deg)",
      });
      setStyle(lineMid, { transform: "translateX(45px)" });

      void lineTop.offsetHeight;
      var tbTransition = "transform 0.5s " + EASING["in-out-quart"];
      setStyle(lineTop, {
        transition: tbTransition,
        transform: "translateX(0px) translateY(8px) rotate(-45deg)",
      });
      setStyle(lineBot, {
        transition: tbTransition,
        transform: "translateX(0px) translateY(-8px) rotate(45deg)",
      });

      await wait(500);

      isOpen = true;
      isAnimating = false;
      setScrollLock(true);
    }

    async function closeMenu() {
      if (!isOpen || isAnimating) return;
      isAnimating = true;

      clearTransitions();
      var shortMove = "transform 0.2s " + EASING["in-out-quart"];
      setStyle(lineBot, {
        transition: shortMove,
        transform: "translateX(45px) translateY(-8px) rotate(45deg)",
      });
      setStyle(lineTop, {
        transition: shortMove,
        transform: "translateX(45px) translateY(8px) rotate(-45deg)",
      });

      await wait(200);

      clearTransitions();
      setStyle(lineTop, { transform: "translateX(45px)" });
      setStyle(lineBot, { transform: "translateX(45px)" });

      setStyle(lineTop, {
        transition: "transform 0.2s " + EASING["in-out-quart"],
        transform: "translateX(0px)",
      });
      setTimeout(function () {
        setStyle(lineMid, {
          transition: "transform 0.2s " + EASING["in-out-quart"],
          transform: "translateX(0px)",
        });
      }, 100);
      setTimeout(function () {
        setStyle(lineBot, {
          transition: "transform 0.2s " + EASING["in-out-quart"],
          transform: "translateX(0px)",
        });
      }, 200);

      setStyle(menu, {
        transition: "opacity 0.5s " + EASING.linear + " 0.2s",
      });
      void menu.offsetHeight;
      setStyle(menu, { opacity: "0" });

      await wait(900);

      clearTransitions();
      setStyle(menu, {
        transform: "translateY(-100%)",
        display: "none",
      });

      isOpen = false;
      isAnimating = false;
      setScrollLock(false);
    }

    function toggleMenu() {
      if (isAnimating) return;
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function onToggleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    }

    function onDocClick(event) {
      if (!isOpen) return;

      var target = event.target;
      if (!target) return;

      var allowed = target.closest(ALLOWED_SELECTOR);
      if (!allowed) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      var isMenuButton = allowed.matches(
        ".navbar_menu-button, #toggleScrollBtn"
      );

      if (isMenuButton) {
        toggleMenu();
        return;
      }

      var navAction = extractNavigationIntent(event, allowed);

      closeMenu().then(function () {
        performNavigationIntent(navAction);
      });
    }

    function extractNavigationIntent(event, el) {
      var a =
        el.tagName === "A"
          ? el
          : el.querySelector
          ? el.querySelector("a[href]")
          : null;

      var intent = {
        type: "none",
        href: null,
        target: null,
        hasModifier:
          event &&
          (event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            event.button === 1),
        shiftKey: event ? !!event.shiftKey : false,
        hashOnly: false,
      };

      if (a && a.getAttribute("href")) {
        var hrefAttr = a.getAttribute("href");
        var hrefAbs = a.href;
        intent.type = "anchor";
        intent.href = hrefAbs;
        intent.target = a.target || "_self";
        intent.hashOnly =
          hrefAttr.charAt(0) === "#" || (hrefAbs && samePageHash(hrefAbs));
        return intent;
      }

      if (el.tagName === "BUTTON") {
        intent.type = "buttonClick";
        intent.element = el;
        return intent;
      }

      intent.type = "elementClick";
      intent.element = el;
      return intent;
    }

    function samePageHash(url) {
      try {
        var u = new URL(url, window.location.href);
        return (
          u.origin === window.location.origin &&
          u.pathname === window.location.pathname &&
          !!u.hash
        );
      } catch (e) {
        return false;
      }
    }

    function performNavigationIntent(intent) {
      if (!intent || intent.type === "none") return;

      if (intent.type === "anchor") {
        if (intent.hasModifier) {
          if (intent.shiftKey) {
            window.open(intent.href, "_blank");
            return;
          }
          window.open(intent.href, "_blank");
          return;
        }
        if (intent.hashOnly) {
          var targetId = intent.href.split("#")[1];
          var targetEl = document.getElementById(
            decodeURIComponent(targetId || "")
          );
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            window.location.hash = "#" + (targetId || "");
          }
          return;
        }
        if (intent.target === "_self" || !intent.target) {
          window.location.assign(intent.href);
        } else if (intent.target === "_parent") {
          window.parent.location.assign(intent.href);
        } else if (intent.target === "_top") {
          if (window.top) window.top.location.assign(intent.href);
          else window.location.assign(intent.href);
        } else {
          window.open(intent.href, intent.target);
        }
        return;
      }

      if (intent.type === "buttonClick" || intent.type === "elementClick") {
        try {
          intent.element.dispatchEvent(
            new MouseEvent("click", { bubbles: true, cancelable: true })
          );
        } catch (e) {}
      }
    }

    // Bind listeners
    btn.addEventListener("click", onToggleClick, true);
    document.addEventListener("click", onDocClick, true);

    // Expose teardown: remove listeners and reset styles/state
    return function teardownController() {
      btn.removeEventListener("click", onToggleClick, true);
      document.removeEventListener("click", onDocClick, true);

      // Reset inline styles and state to initial closed state
      isOpen = false;
      isAnimating = false;
      setScrollLock(false);

      // Clean inline styles that we may have touched
      setStyle(menu, {
        transition: "",
        transform: "",
        opacity: "",
        display: "",
        willChange: "",
      });
      setStyle(lineTop, { transition: "", transform: "", willChange: "" });
      setStyle(lineMid, { transition: "", transform: "", willChange: "" });
      setStyle(lineBot, { transition: "", transform: "", willChange: "" });
    };
  }

  function enableIfNeeded(e) {
    if (MQ.matches) {
      if (!teardown) {
        teardown = initMobileMenuController();
      }
    } else {
      if (teardown) {
        teardown();
        teardown = null;
      }
    }
  }

  // Initial check
  enableIfNeeded();

  // Respond to size changes
  if (typeof MQ.addEventListener === "function") {
    MQ.addEventListener("change", enableIfNeeded);
  } else if (typeof MQ.addListener === "function") {
    // Safari fallback
    MQ.addListener(enableIfNeeded);
  }

  // Optional: also listen to orientationchange as a fallback
  window.addEventListener("orientationchange", function () {
    // slight delay to allow layout to settle
    setTimeout(enableIfNeeded, 100);
  });
})();
