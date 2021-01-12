import months from "./months";
import { monthContainer } from "./calendar";
import { createDiv } from "./dom";
import "./scroll";

let currentWeek = 1;
let currentYear = new Date().getFullYear();

// Mobile menu button handler
const hamburger = document.querySelector(".hamburger");
const mainMenu = document.querySelector(".main-menu");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mainMenu.classList.toggle("open");
});

// Nav link handlers
const navLinks = document.querySelectorAll(".main-menu div");
navLinks.forEach(navLink => {
  navLink.addEventListener("click", e => {
    currentWeek = Number(e.currentTarget.dataset.week);
    renderCalendar(currentYear, currentWeek);
    if (hamburger.classList.contains("open"))
      hamburger.classList.remove("open");
    if (mainMenu.classList.contains("open")) mainMenu.classList.remove("open");
  });
});

// Create a container to hold the calendar
const calendarContainer = createDiv("", "calendar-container");
document.querySelector(".page-container").appendChild(calendarContainer);

// Render the calendar after removing any existing calendar
function renderCalendar(year, week) {
  while (calendarContainer.firstChild)
    calendarContainer.removeChild(calendarContainer.firstChild);
  months.forEach(month =>
    calendarContainer.appendChild(monthContainer(year, month, week))
  );
}

renderCalendar(currentYear, currentWeek);
