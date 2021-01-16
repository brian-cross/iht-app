import rotation from "./rotation";
import { createDiv } from "./dom";
import getHolidays from "./holidays";

getHolidays().then(holidays => console.log(holidays));

/**
 * Creates a calendar block for the specified month and year
 * @param {number} year - 4 digit year
 * @param {string} month - Name of the month
 * @param {number} week - Schedule rotation week (1 2 3 or 4)
 */
export function monthContainer(year, month, week = 1) {
  const millisecondsPerDay = 1000 * 3600 * 24;
  const dayHeadings = "S,M,T,W,T,F,S".split(",");

  // Get number of days in the month being rendered
  const daysInMonth = numDaysInMonth(year, month);

  // Rotation referenced off this date
  const rotationStart = Date.parse("January 3, 2021");
  // Number of days between the rotation start date and the start of the month being rendered
  const rotationOffset = Math.ceil(
    (Date.parse(`${month} 1, ${year}`) - rotationStart) / millisecondsPerDay
  );

  // Figure out where the shift rotation starts in the current month
  let rotationIndex = (rotationOffset % rotation.length) + (week - 1) * 7;
  if (rotationIndex < 0) rotationIndex += rotation.length;

  // Day of the week that the month starts and ends
  const startDay = new Date(`${month} 1, ${year} 00:00:00`).getDay();
  const endDay = new Date(`${month} ${daysInMonth}, ${year} 00:00:00`).getDay();

  const monthContainer = createDiv("", "month-container");

  // Month heading
  monthContainer.appendChild(monthHeading(year, month, week));

  // Day heading cells
  dayHeadings.forEach(heading => {
    monthContainer.appendChild(dayHeading(heading));
  });

  // Start padding cells
  for (let paddingCount = startDay; paddingCount >= 1; paddingCount--) {
    monthContainer.appendChild(paddingCell());
  }

  // Calendar date cells
  for (let day = 1; day <= daysInMonth; day++) {
    monthContainer.appendChild(
      dayCell(day, rotation[rotationIndex++ % rotation.length])
    );
  }

  // End padding cells
  for (let paddingCount = 6 - endDay; paddingCount > 0; paddingCount--) {
    monthContainer.appendChild(paddingCell());
  }

  return monthContainer;
}

/**
 * Creates a day heading grid cell
 * @param {string} day - First letter of the day (S, M, T...)
 */
export function dayHeading(day) {
  return createDiv(day, "day-heading");
}

/**
 * Creates a calendar grid cell containing the numeric day of the month
 * @param {number} dayNumber - Number of the day in the month
 * @param {number} type - 0: day off, 1: weekday shift, 2: weekend shift
 */
export function dayCell(dayNumber, type = 0) {
  let className = "day";

  switch (type) {
    case 0:
      className = "day day-off";
      break;
    case 1:
      className = "day weekday-shift";
      break;
    case 2:
      className = "day weekend-shift";
      break;
    default:
      throw new Error("Invalid day type. Must be 0, 1 or 2.");
  }

  return createDiv(dayNumber, className);
}

/**
 * Creates an empty calendar grid cell with the style set to inactive
 */
export function paddingCell() {
  return createDiv("", "day inactive");
}

/**
 * Creates a heading with the year, month and week of the rotation
 * @param {number} year - 4 digit year
 * @param {string} month - Name of the month
 * @param {number} week - Schedule rotation week (1 2 3 or 4)
 */
export function monthHeading(year, month, week) {
  const container = document.createElement("div");
  container.classList.add("month-heading");
  const yearSpan = document.createElement("span");
  const monthSpan = document.createElement("span");
  const weekSpan = document.createElement("span");
  yearSpan.textContent = year;
  monthSpan.textContent = month;
  weekSpan.textContent = `W${week}`;
  container.appendChild(yearSpan);
  container.appendChild(monthSpan);
  container.appendChild(weekSpan);
  return container;
}

/**
 * Given a year and month, returns the number of days in that month. The year is required to calculate leap years.
 * @param {number} year - 4 digit year
 * @param {number} month - The full name of the month (January, February, etc...)
 */
export function numDaysInMonth(year, month) {
  if (
    month === "April" ||
    month === "June" ||
    month === "September" ||
    month === "November"
  )
    return 30;
  if (month === "February") {
    if (year % 4 !== 0) return 28;
    if (year % 100 !== 0) return 29;
    if (year % 400 !== 0) return 28;
    return 29;
  }
  return 31;
}
