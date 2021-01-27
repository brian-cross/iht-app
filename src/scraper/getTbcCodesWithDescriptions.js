async function getTbcCodesWithDescriptions(page) {
  console.log("in callback");
  await page.waitForSelector("iframe");
  const frame = page
    .frames()
    .find(frame => frame.name() === "__gadget_j-app-tile-parent-46360");

  const content = await frame.$eval("div.content-wrap");

  console.log(content);

  // await page.evaluate(async () => {
  // console.log("puppeteer script");
  // const iframe = document.querySelector("iframe").src;
  // const content = iframe.querySelector("div.content-wrap");
  // console.log(iframe);
  // });

  return "getTbcCodesWithDescriptions";
}

module.exports = getTbcCodesWithDescriptions;
