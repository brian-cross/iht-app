const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const puppeteer = require("puppeteer");

/**
 * Callback which implements page scraping for task based codes.
 * Downloads and parses the PDF code sheet.
 * Returns a promise that resolves to an array of objects with codes and rates:
 * [
 *  {
 *    code: 123,
 *    rate: $1.00
 *  } ...
 * ]
 * @param {puppeteer.Page} - The page instance to scrape.
 */
async function getTbcCodesWithRates(page) {
  const downloadPath = __dirname;
  const fileName = "IHT Quick Reference Guide - Apr 30 2020.pdf";

  // Set download path for TBC code PDF file
  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath,
  });

  // Download the file
  await page.waitForSelector("a.jive-link-attachment-small");
  await page.click("a.jive-link-attachment-small");
  await waitForFileExists(path.join(downloadPath, fileName));

  // Pull the text out of the PDF file
  const dataBuffer = fs.readFileSync(path.join(downloadPath, fileName));
  const pdfText = await pdf(dataBuffer).then(data => data.text);

  // Use a regex to match the 3 digit TBC code and its associated pay rate
  const matches = pdfText.match(
    /(?<!\d)\d{3}(?![\.\d+])|\$\d{1,3}\.\d{2}(?!\d)/gm
  );

  const codesWithRates = [];

  // The last match in the array is an extra 3 digit code we don't need so
  // we skip the last array element.
  for (let i = 0; i < matches.length - 1; i += 2) {
    codesWithRates.push({
      code: matches[i],
      rate: matches[i + 1],
    });
  }

  return codesWithRates;
}

/**
 * From @xprudhomme.
 * Check if file exists, watching containing directory meanwhile.
 * Resolve if the file exists, or if the file is created before the timeout
 * occurs.
 * @param {string} filePath
 * @param {integer} timeout
 * @returns {!Promise<undefined>} Resolves when file has been created. Rejects
 *     if timeout is reached.
 */
function waitForFileExists(filePath, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath);

    const watcher = fs.watch(dir, (eventType, filename) => {
      if (eventType === "rename" && filename === basename) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });

    const timer = setTimeout(() => {
      watcher.close();
      reject(
        new Error(
          " [checkFileExists] File does not exist, and was not created during the timeout delay."
        )
      );
    }, timeout);

    fs.access(filePath, fs.constants.R_OK, err => {
      if (!err) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });
  });
}

module.exports = getTbcCodesWithRates;
