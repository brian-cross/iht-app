const fs = require("fs");
const path = require("path");

const getServiceCodes = require("./getServiceCodes");

const fileName = "serviceCodes.json";

getServiceCodes().then(async codes => {
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
