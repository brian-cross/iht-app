require("dotenv").config();
const fs = require("fs");
const path = require("path");

const scrapePage = require("./scrapePage");
const getServiceCodes = require("./getServiceCodes");
const getTbcCodes = require("./getTbcCodes");

const serviceCodesFileName = "serviceCodes.json";
const tbcCodesFileName = "tbcCodes.json";

const {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  TBC_CODES_URL,
  SERVICE_CODES_URL,
} = process.env;

// scrapePage(getServiceCodes, {
//   email: LOGIN_EMAIL,
//   password: LOGIN_PASSWORD,
//   url: SERVICE_CODES_URL,
// }).then(async codes => {
//   console.log("Writing file.");
//   fs.writeFile(
//     path.join(__dirname, serviceCodesFileName),
//     JSON.stringify(codes, null, 2),
//     err => {
//       if (err) return console.log(err);
//       console.log("Wrote file.");
//     }
//   );
// });

scrapePage(getTbcCodes, {
  email: LOGIN_EMAIL,
  password: LOGIN_PASSWORD,
  url: TBC_CODES_URL,
}).then(data => {
  console.log(data);
});
