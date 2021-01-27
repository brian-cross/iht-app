require("dotenv").config();
const fs = require("fs");
const path = require("path");

const scrapePage = require("./scrapePage");
const getServiceCodes = require("./getServiceCodes");
const getTbctbcWithRates = require("./getTbctbcWithRates");
const getTbctbcWithDescriptions = require("./getTbctbcWithDescriptions");

const serviceCodesFileName = "serviceCodes.json";
const tbcCodesFileName = "tbcCodes.json";

const {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  TBC_CODES_URL,
  TBC_PDF_URL,
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

(async function () {
  const [serviceCodes, tbcWithRates, tbcWithDescriptions] = await Promise.all([
    scrapePage(getServiceCodes, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
      url: SERVICE_CODES_URL,
    }),
    scrapePage(getTbctbcWithRates, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
      url: TBC_PDF_URL,
    }),
    scrapePage(getTbctbcWithDescriptions, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
      url: TBC_CODES_URL,
    }),
  ]);

  // Write service codes JSON file
  fs.writeFile(
    path.join(__dirname, serviceCodesFileName),
    JSON.stringify(serviceCodes, null, 2),
    err => {
      if (err) return console.log(err);
    }
  );

  console.log(tbcWithRates);
  console.log(tbcWithDescriptions);
})();
