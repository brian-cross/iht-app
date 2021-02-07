import * as serviceCodesData from "../json/serviceCodes.json";
import * as tbcCodesData from "../json/tbcCodes.json";

// Grab the code objects from the imported JSON data
const tbcCodes = tbcCodesData.default;
const serviceCodes = serviceCodesData.default.reduce((acc, curr) => {
  return acc.concat(curr.codes);
}, []);

// Query DOM - input field and node to render the search results
const searchInput = document.getElementById("code-search-input");
const resultList = document.querySelector(".search-result-list");
const clearInputBtn = document.querySelector(".code-search-clear-btn");

// Enable clearInputBtn animation after a delay to prevent playing on page load
window.onload = () => {
  setTimeout(() => clearInputBtn.classList.remove("preload"), 500);
};

searchInput.addEventListener("input", handleSearchInput);
clearInputBtn.addEventListener("click", handleClearInputBtn);

let searchResults = [];
let inputDebounceId;
const inputDebounceInverval = 500;

// Search input event handler
// Runs the search after a debounce interval
function handleSearchInput(e) {
  clearTimeout(inputDebounceId);

  if (e.target.value.length === 0) {
    hideInputClearButton();
    clearSearchResults();
    return;
  } else showInputClearButton();

  inputDebounceId = setTimeout(() => {
    const results = doCodeSearch(e.target.value);
    renderSearchResults(results);
  }, inputDebounceInverval);
}

// Searches the TBC and service codes arrays and returns an array of matches
function doCodeSearch(searchString) {
  if (!searchString) searchResults = [];
  else {
    const regex = new RegExp(
      "^" +
        searchString
          .split(" ")
          .filter(keyword => keyword)
          .map(keyword => `(?=.*${keyword})`)
          .join("") +
        ".+",
      "gi"
    );

    const serviceCodeResults = serviceCodes.filter(code => {
      if (
        regex.test(code.code) ||
        regex.test(code.title) ||
        regex.test(code.description)
      )
        return code;
    });

    const tbcCodeResults = tbcCodes.filter(code => {
      if (regex.test(code.code) || regex.test(code.title)) return code;
    });

    searchResults = [...tbcCodeResults, ...serviceCodeResults];
  }

  return searchResults;
}

// Renders the search results array to the DOM or a message if none found.
function renderSearchResults(searchResults) {
  clearSearchResults();

  if (searchResults.length === 0 && searchInput.value.length > 0) {
    console.log("No results");
    const noResults = document.createElement("li");
    noResults.classList.add("search-result-item");
    noResults.innerHTML = `
    <div class="search-result-item-header">
      <h2 class="no-search-results">No result found</h2>
    </div>`;
    resultList.appendChild(noResults);
    return;
  }

  searchResults
    .map(result => {
      const listItem = document.createElement("li");

      listItem.classList.add("search-result-item");
      listItem.classList.add(result.rate ? "tbc-code" : "service-code");

      listItem.innerHTML = `
      <div class="search-result-item-header">
        <h2 class="code-number">${result.code}</h2>
        <h3 class="code-rate">${result.rate ? result.rate : ""}</h3>
      </div>
      <h3 class="code-title">${result.title}</h3>
      <p class="code-description">${
        result.description ? result.description : ""
      }</p>
    `;

      return listItem;
    })
    .forEach(result => resultList.appendChild(result));
}

// Clears the input field and search results
function handleClearInputBtn() {
  searchInput.value = "";
  clearSearchResults();
  hideInputClearButton();
  searchInput.focus();
}

// Utility functions
function clearSearchResults() {
  while (resultList.firstChild) resultList.removeChild(resultList.firstChild);
}

function showInputClearButton() {
  clearInputBtn.classList.remove("hidden");
  clearInputBtn.classList.add("visible");
}

function hideInputClearButton() {
  clearInputBtn.classList.remove("visible");
  clearInputBtn.classList.add("hidden");
}
