require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const puppeteer = require("puppeteer");

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

/**
 * Callback which implements page scraping for task based codes.
 * Downloads and parses the PDF code sheet.
 * Returns a promise which resolves to an array of code table objects.
 * @param {puppeteer.Page} - The page instance to scrape.
 */
async function getTbcCodes(page) {
  const downloadPath = __dirname;
  const fileName = "IHT Quick Reference Guide - Apr 30 2020.pdf";

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath,
  });

  await page.waitForSelector("a.jive-link-attachment-small");
  await page.click("a.jive-link-attachment-small");

  await waitForFileExists(path.join(downloadPath, fileName));

  const dataBuffer = fs.readFileSync(path.join(downloadPath, fileName));

  pdf(dataBuffer).then(data => {
    console.log(data.text);
  });

  return "getTbcCodes success";
}

module.exports = getTbcCodes;
