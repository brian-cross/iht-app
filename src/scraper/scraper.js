const puppeteer = require("puppeteer");
require("dotenv").config();

async function test() {
  console.log(process.env.SERVICE_CODES_URL);
  const options = { headless: false, slowMo: 100 };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(process.env.SERVICE_CODES_URL);
  await page.waitForSelector("#sso-login-submit");
  await page.click("#sso-login-submit");
  await page.waitForSelector("#userNameInput");
  await page.type("#userNameInput", process.env.LOGIN_EMAIL);
  await page.type("#passwordInput", process.env.LOGIN_PASSWORD);
  await page.click("#submitButton");
  // await browser.close();
}

test();
