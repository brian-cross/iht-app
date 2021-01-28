require("dotenv").config();
const fs = require("fs");
const path = require("path");

const scrapePage = require("./scrapePage");
const getServiceCodes = require("./getServiceCodes");
const getTbcCodes = require("./getTbcCodes");

const jsonFilesDir = path.join(__dirname, "../json");
const serviceCodesFilePath = path.join(jsonFilesDir, "serviceCodes.json");
const tbcCodesFilePath = path.join(jsonFilesDir, "tbcCodes.json");

const {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  TBC_PDF_URL,
  SERVICE_CODES_URL,
} = process.env;

scrapePage(getTbcCodes, {
  email: LOGIN_EMAIL,
  password: LOGIN_PASSWORD,
  url: TBC_PDF_URL,
}).then(tbcCodes => {
  writeJSONFile(tbcCodesFilePath, tbcCodes);
});

scrapePage(getServiceCodes, {
  email: LOGIN_EMAIL,
  password: LOGIN_PASSWORD,
  url: SERVICE_CODES_URL,
}).then(serviceCodes => {
  writeJSONFile(serviceCodesFilePath, serviceCodes);
});

function writeJSONFile(path, data) {
  fs.writeFile(path, JSON.stringify(data, null, 2), err => {
    if (err) throw new Error(err);
    else console.log(`File written successfully: "${path}"`);
  });
}
