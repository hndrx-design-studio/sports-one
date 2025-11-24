document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq1_list .faq1_item"); // Select all FAQ items
  const loadMoreButton = document.querySelector(".load-more"); // Select the load more button

  let visibleItems = 8; // Number of items to show initially
  const itemsToShow = 3; // Number of items to show on each click

  // Hide all items except the first 'visibleItems'
  faqItems.forEach((item, index) => {
    if (index >= visibleItems) {
      item.style.display = "none";
    }
  });

  // Event listener for load more button
  loadMoreButton.addEventListener("click", function () {
    // Show next set of items
    for (let i = visibleItems; i < visibleItems + itemsToShow; i++) {
      if (faqItems[i]) {
        faqItems[i].style.display = "block";
      }
    }

    // Update the count of visible items
    visibleItems += itemsToShow;

    // If all items are visible, hide the load more button
    if (visibleItems >= faqItems.length) {
      loadMoreButton.style.display = "none";
    }
  });
});
