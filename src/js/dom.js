/**
 * Creates a `div` element with the provided text content and CSS class(es).
 * @param {string} content - A string to be inserted into the div's textContent property
 * @param {string} classNames - Space separated string of CSS classes, eg: "class1 class2"
 */
export function createDiv(content, classNames) {
  const div = document.createElement("div");
  div.textContent = content;
  classNames.split(" ").forEach(c => {
    // Ignore extra whitespace
    if (c) div.classList.add(c);
  });
  return div;
}
