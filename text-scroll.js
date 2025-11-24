// window.addEventListener("load", () => {
//   gsap.registerPlugin(ScrollTrigger);

//   // Initial setup: clear previous inline styles that might linger
//   gsap.set(".section_text-scroll, .wrapper, .item, .item > *", {
//     clearProps: "all",
//   });

//   // Transform origin and initial state for items
//   gsap.set(".item", { transformOrigin: "50% 50%" });
//   gsap.set(".item:not(:first-of-type)", { opacity: 0.1, scale: 0.9 });

//   // Set initial vertical positions for stacked items
//   const spacing = 200;
//   const items = Array.from(document.querySelectorAll(".item"));
//   items.forEach((el, i) => {
//     gsap.set(el, { y: i * spacing });
//   });

//   const tl = gsap.timeline();

//   // Build a state for each focus index
//   items.forEach((_, index) => {
//     const state = gsap.timeline();
//     const totalItems = items.length;

//     // Position all items relative to the focused index
//     items.forEach((__, i) => {
//       const distance = i - index;
//       const yPos = distance * spacing;
//       state.to(items[i], { y: yPos }, 0);
//     });

//     // Focused item
//     state.to(items[index], { opacity: 1, scale: 1 }, 0);

//     // Adjacent items
//     if (index > 0) {
//       state.to(items[index - 1], { opacity: 0.3, scale: 0.9 }, 0);
//     }
//     if (index < totalItems - 1) {
//       state.to(items[index + 1], { opacity: 0.3, scale: 0.9 }, 0);
//     }

//     // All other items
//     const others = items.filter(
//       (_, i) => i !== index && i !== index - 1 && i !== index + 1
//     );
//     if (others.length) {
//       state.to(others, { opacity: 0.1, scale: 0.9 }, 0);
//     }

//     // Add a label so snapping lands on each state cleanly
//     tl.addLabel(`section-${index}`).add(state, `section-${index}`);
//   });

//   ScrollTrigger.create({
//     trigger: ".section_text-scroll",
//     start: "top top",
//     end: "bottom bottom",
//     pin: ".wrapper",
//     pinSpacing: true,
//     markers: false,
//     animation: tl,
//     scrub: 0.5,
//     snap: {
//       snapTo: (value) => {
//         const labels = Object.keys(tl.labels);
//         const labelPositions = labels.map((label) => tl.labels[label]);

//         let closest = labelPositions.reduce((prev, curr) =>
//           Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
//         );

//         if (value > labelPositions[labelPositions.length - 1] - 0.1) {
//           return labelPositions[labelPositions.length - 1];
//         }
//         return closest;
//       },
//       duration: 0.3,
//       ease: "power1.inOut",
//     },
//   });

//   ScrollTrigger.refresh(true);
// });

window.addEventListener("load", () => {
  const mediaQuery = window.matchMedia("(min-width: 992px)");
  let scrollTriggerInstance = null;

  function initScrollAnimation() {
    // Clean up any existing instance
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Clear any existing styles
    gsap.set(".section_text-scroll, .wrapper, .item, .item > *", {
      clearProps: "all",
    });

    // Only proceed if viewport is >= 992px
    if (!mediaQuery.matches) {
      ScrollTrigger.refresh();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Transform origin and initial state for items
    gsap.set(".item", { transformOrigin: "50% 50%" });
    gsap.set(".item:not(:first-of-type)", { opacity: 0.1, scale: 0.9 });

    // Set initial vertical positions for stacked items
    const spacing = 200;
    const items = Array.from(document.querySelectorAll(".item"));
    items.forEach((el, i) => {
      gsap.set(el, { y: i * spacing });
    });

    const tl = gsap.timeline();

    // Build a state for each focus index
    items.forEach((_, index) => {
      const state = gsap.timeline();
      const totalItems = items.length;

      // Position all items relative to the focused index
      items.forEach((__, i) => {
        const distance = i - index;
        const yPos = distance * spacing;
        state.to(items[i], { y: yPos }, 0);
      });

      // Focused item
      state.to(items[index], { opacity: 1, scale: 1 }, 0);

      // Adjacent items
      if (index > 0) {
        state.to(items[index - 1], { opacity: 0.3, scale: 0.9 }, 0);
      }
      if (index < totalItems - 1) {
        state.to(items[index + 1], { opacity: 0.3, scale: 0.9 }, 0);
      }

      // All other items
      const others = items.filter(
        (_, i) => i !== index && i !== index - 1 && i !== index + 1
      );
      if (others.length) {
        state.to(others, { opacity: 0.1, scale: 0.9 }, 0);
      }

      tl.addLabel(`section-${index}`).add(state, `section-${index}`);
    });

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".section_text-scroll",
      start: "top top",
      end: "bottom bottom",
      pin: ".wrapper",
      pinSpacing: true,
      markers: false,
      animation: tl,
      scrub: 0.5,
    });

    ScrollTrigger.refresh(true);
  }

  // Initialize on load
  initScrollAnimation();

  // Re-initialize on viewport resize
  mediaQuery.addEventListener("change", initScrollAnimation);
});
