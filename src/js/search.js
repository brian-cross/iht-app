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

searchInput.addEventListener("input", handleSearchInput);

let searchResults;
let inputDebounceId;
const inputDebounceInverval = 300;

// Search input event handler.
// Runs the search after a debounce interval.
function handleSearchInput(e) {
  clearTimeout(inputDebounceId);
  inputDebounceId = setTimeout(
    () => doCodeSearch(e.target.value),
    inputDebounceInverval
  );
}

function doCodeSearch(searchString) {
  if (searchString.length === 0) return;

  const regex = new RegExp(searchString, "i");

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

  console.log(searchResults);
}
