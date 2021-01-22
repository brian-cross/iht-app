require("dotenv").config();
const fs = require("fs");
const path = require("path");

const scrapePage = require("./scrapePage");
const getServiceCodes = require("./getServiceCodes");

const fileName = "serviceCodes.json";

const {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  TBC_CODES_URL,
  SERVICE_CODES_URL,
} = process.env;

scrapePage(getServiceCodes, {
  email: LOGIN_EMAIL,
  password: LOGIN_PASSWORD,
  url: SERVICE_CODES_URL,
}).then(async codes => {
  console.log("Writing file.");
  fs.writeFile(
    path.join(__dirname, fileName),
    JSON.stringify(codes, null, 2),
    err => {
      if (err) return console.log(err);
      console.log("Wrote file.");
    }
  );
});
