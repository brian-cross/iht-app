const puppeteer = require("puppeteer");
require("dotenv").config();

async function test() {
  const { LOGIN_EMAIL, LOGIN_PASSWORD, SERVICE_CODES_URL } = process.env;

  const options = { headless: false };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await page.goto(SERVICE_CODES_URL);

  await page.waitForSelector("#sso-login-submit", { visible: true });
  await page.click("#sso-login-submit");

  await page.waitForSelector("#userNameInput");
  await page.type("#userNameInput", LOGIN_EMAIL);
  await page.type("#passwordInput", LOGIN_PASSWORD);
  await page.click("#submitButton");

  const tables = await page.evaluate(() => {
    // return document.querySelectorAll("table.tablesorter");
    return 1;
  });

  console.log(tables);

  // await browser.close();
}

test();
