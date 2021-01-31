/*******************************************************************************
 * Hides / shows header on scroll
 ******************************************************************************/
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

/*******************************************************************************
 * Handles opening / closing of the menu
 ******************************************************************************/
let menuIsOpen = false;

const hamburger = document.querySelector(".hamburger");
const mainMenu = document.querySelector(".main-menu");
hamburger.addEventListener("click", handleMenuOpenClose);

// Page overlay for closing the menu
const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", handleMenuOpenClose);

// Open or close the menu
export function handleMenuOpenClose() {
  menuIsOpen = !menuIsOpen;
  if (menuIsOpen) {
    hamburger.classList.add("open");
    mainMenu.classList.add("open");
    overlay.style.display = "block";
  } else {
    hamburger.classList.remove("open");
    mainMenu.classList.remove("open");
    overlay.style.display = "none";
  }
}
