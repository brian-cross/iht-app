require("dotenv").config();
const puppeteer = require("puppeteer");

/**
 * Callback which implements page scraping for service call codes.
 * Returns a promise which resolves to an array of code table objects.
 * @param {puppeteer.Page} - The page instance to scrape.
 */
async function getServiceCodes(page) {
  await page.waitForSelector("a[name^=list]");
  await page.waitForSelector("table.tablesorter");

  const serviceCodes = await page.evaluate(async () => {
    const codeTables = [];

    // Tables used from site:
    // 1, 2, 3, 4, 5, 6, 8, 11, 12, 15
    const tableIndexes = [1, 2, 3, 4, 5, 6, 8, 11, 12, 15];

    const tableBodies = document.querySelectorAll("table.tablesorter > tbody");

    // The headings are accompanied by empty anchor tags both shared within
    // a parent element. Use this to find the headings.
    const headingAnchorTags = document.querySelectorAll("a[name^=list]");

    tableIndexes.forEach(i => {
      const table = {
        heading: "",
        codes: [],
      };

      // Table headings
      const tableHeading = headingAnchorTags[i - 1].parentElement.textContent;

      table.heading = tableHeading;

      const tableRows = tableBodies[i - 1].querySelectorAll("tr");

      tableRows.forEach(row => {
        const cell1 = row.childNodes[0];
        const cell2 = row.childNodes[1];

        // Strip off the start and end brackets from the numeric code
        const code = cell1.textContent.substring(1, 4);
        // The title of the code
        const title = cell2.childNodes[0].textContent.trim();
        // If the second cell isn't there use an empty string, otherwise
        // it contains the description of the code
        const description = cell2?.childNodes[1]?.textContent.trim() || "";

        table.codes.push({
          code,
          title,
          description,
        });
      });

      codeTables.push(table);
    });
    return codeTables;
  });

  return serviceCodes;
}

module.exports = getServiceCodes;
