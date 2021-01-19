const puppeteer = require("puppeteer");

async function test() {
  const serviceCodesUrl = "https://thepipe.sjrb.ca/docs/DOC-42236";
  const options = { headless: false, slowMo: 250 };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(serviceCodesUrl);
  await page.waitForSelector("#sso-login-submit");
  await page.click("#sso-login-submit");
  await browser.close;
}

test();
