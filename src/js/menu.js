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
