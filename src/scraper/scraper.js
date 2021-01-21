require("dotenv").config();
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

let browser;

/**
 * Navigates to the required web page, logs in and scrapes the IHT service call
 * resolution codes. Returns a promise which resolves to an array of code table
 * objects.
 */
async function fetchServiceCodes() {
  const {
    LOGIN_EMAIL,
    LOGIN_PASSWORD,
    NODE_ENV,
    SERVICE_CODES_URL,
  } = process.env;

  const options = NODE_ENV === "production" ? null : { devtools: true };

  console.log("Launching browser.");
  browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  console.log(`Navigating to ${SERVICE_CODES_URL}`);
  await page.goto(SERVICE_CODES_URL);

  await page.waitForSelector("#sso-login-submit", { visible: true });
  await page.click("#sso-login-submit");

  console.log("Logging in.");
  await page.waitForSelector("#userNameInput");
  await page.type("#userNameInput", LOGIN_EMAIL);
  await page.type("#passwordInput", LOGIN_PASSWORD);
  await page.click("#submitButton");

  console.log("Waiting for page load.");

  await waitForPageLoad(page);

  console.log("Getting service codes.");

  await page.waitForSelector("a[name^=list]");
  await page.waitForSelector("table.tablesorter");

  return await page.evaluate(() => {
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
}

/**
 * Sets up an event listener that triggers when the page is loaded.
 * Returns a promise which resolves when the event fires.
 * @param {puppeteer.Page} page - The puppeteer page instance to wait for
 */
function waitForPageLoad(page) {
  return new Promise(resolve => {
    page.on("load", () => {
      resolve();
    });
  });
}

fetchServiceCodes().then(async codes => {
  console.log("Writing file.");
  fs.writeFile(
    path.join(__dirname, "serviceCodes.json"),
    JSON.stringify(codes, null, 2),
    err => {
      if (err) return console.log(err);
      console.log("Wrote file.");
    }
  );

  console.log("Closing browser.");
  await browser.close();
});
