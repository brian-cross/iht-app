const header = document.querySelector("header");

let currentY = window.pageYOffset,
  scrolledY = window.pageYOffset,
  delta = 0;

window.addEventListener("scroll", () => {
  scrolledY = window.pageYOffset;
  delta = scrolledY - currentY;
  // Hide header when page is scrolled down
  if (delta > 5) {
    header.classList.add("hidden");
    currentY = scrolledY;
  }
  // Show header when page is scrolled up or when scroll is close to top
  if (delta < -5 || scrolledY < 75) {
    header.classList.remove("hidden");
    currentY = scrolledY;
  }
});
