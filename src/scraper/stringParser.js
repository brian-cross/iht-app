const testString = require("./testData");

const pattern = /(?<!\d)\d{3}(?![\.\d+])|\$\d{1,3}\.\d{2}(?!\d)/gm;

const matches = testString.match(pattern);

const codes = [];

for (let i = 0; i < matches.length - 1; i += 2) {
  codes.push({
    code: matches[i],
    rate: matches[i + 1],
  });
}

console.log(codes);
console.log(codes.length);
