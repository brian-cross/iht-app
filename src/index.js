import months from "./months";
import { monthContainer } from "./calendar";

// Grab the div where we will render the calendar
const container = document.querySelector(".page-container");

// Render the calendar for each month
months.forEach(month => container.appendChild(monthContainer(2021, month, 3)));
