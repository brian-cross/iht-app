const fs = require("fs");
const path = require("path");
const { PdfReader } = require("pdfreader");
const puppeteer = require("puppeteer");

/**
 * Callback which implements page scraping for task based codes.
 * Downloads and parses the PDF code sheet.
 * Returns a promise that resolves to an array of objects with codes,
 * descriptions and rates:
 * [
 *  {
 *    code: 123,
 *    description, "The description",
 *    rate: $1.00
 *  }, ...
 * ]
 * @param {puppeteer.Page} - The page instance to scrape.
 */
async function getTbcCodes(page) {
  const downloadPath = __dirname;
  const fileName = "IHT Quick Reference Guide - Apr 30 2020.pdf";
  const filePath = path.join(downloadPath, fileName);

  // Set download path for TBC code PDF file
  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath,
  });

  // Download the file
  await page.waitForSelector("a.jive-link-attachment-small");
  await page.click("a.jive-link-attachment-small");
  await waitForFileExists(filePath);

  // Extract the raw text strings from the PDF file
  const pdfStrings = await new Promise((resolve, reject) => {
    const items = [];
    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(items);
      else if (item.text) {
        items.push(item.text.trim());
      }
    });
  });

  // Clean up - delete the PDF
  fs.unlink(filePath, err => {
    if (err) console.log(err);
  });

  // Build the array of code objects and return it
  const tbcCodes = [];

  pdfStrings.forEach((str, index) => {
    if (str.match(/^\d{3}$/gm)) {
      tbcCodes.push({
        code: str,
        description: pdfStrings[index + 1],
        rate: pdfStrings[index + 2],
      });
    }
  });

  return tbcCodes;
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

module.exports = getTbcCodes;
