// gsap.utils.toArray(".orgs-card_body").forEach(function (card) {
//   gsap.set(card, {
//     transformStyle: "preserve-3d",
//     transformPerspective: 1000,
//   });
//   const q = gsap.utils.selector(card);
//   const front = q(".orgs-card_body-front");
//   const back = q(".orgs-card_body-back");

//   gsap.set(back, { rotationY: -180 });

//   const tl = gsap
//     .timeline({ paused: true })
//     .to(front, { duration: 1, rotationY: 180 })
//     .to(back, { duration: 1, rotationY: 0 }, 0)
//     .to(card, { z: 50 }, 0)
//     .to(card, { z: 0 }, 0.5);
//   card.addEventListener("mouseenter", function () {
//     tl.play();
//   });
//   card.addEventListener("mouseleave", function () {
//     tl.reverse();
//   });
// });

// gsap.utils.toArray(".orgs-card_body").forEach(function (card) {
//   const q = gsap.utils.selector(card);
//   const front = q(".orgs-card_body-front");
//   const back = q(".orgs-card_body-back");

//   gsap.set(card, {
//     transformStyle: "preserve-3d",
//     transformPerspective: 1000,
//   });
//   gsap.set(back, { rotationY: -180 });

//   const tl = gsap
//     .timeline({ paused: true })
//     .to(front, { duration: 1, rotationY: 180 }, 0)
//     .to(back, { duration: 1, rotationY: 0 }, 0)
//     .to(card, { z: 50 }, 0)
//     .to(card, { z: 0 }, 0.5);

//   card.addEventListener("mouseenter", () => tl.play());
//   card.addEventListener("mouseleave", () => tl.reverse());
// });

gsap.utils.toArray(".orgs-card").forEach(function (card) {
  const q = gsap.utils.selector(card);
  const front = q(".orgs-card_body-front");
  const back = q(".orgs-card_body-back");
  const heading = card
    .closest(".orgs-card")
    ?.querySelector(".orgs-card_heading");

  // Keep preserve-3d; perspective is optional
  gsap.set(card, {
    transformStyle: "preserve-3d",
    // transformPerspective: 1000, // optional; remove to reduce any depth feel
  });
  gsap.set(back, { rotationY: -180 });

  const tl = gsap
    .timeline({ paused: true })
    // flip only, no z-translation
    .to(front, { duration: 1, rotationY: 180 }, 0)
    .to(back, { duration: 1, rotationY: 0 }, 0)
    // heading fade 0.5 -> 1 in the same duration
    .to(heading, { duration: 1, opacity: 1, overwrite: "auto" }, 0);

  card.addEventListener("mouseenter", function () {
    tl.play();
  });
  card.addEventListener("mouseleave", function () {
    tl.reverse();
  });
});
