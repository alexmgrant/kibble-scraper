const fs = require("fs");
const Apify = require("apify");
const { log } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);
const greenies = require("./greenies");
const convertToCsv = require("./convert-shopify-product-csv");
const data = require("./apify_storage/datasets/default/000000018.json");

Apify.main(async () => {
  const requestList = await Apify.openRequestList("my-list", [
    {
      url:
        "https://www.greenies.com/products/dog/dental-treats/original-dental-treats/greenies-original-teenie-dog-dental-treats",
    },
    {
      url:
        "https://www.greenies.com/products/dog/dental-treats/original-dental-treats/greenies-fresh-teenie-dog-dental-treats",
    },
  ]);

  const crawler = new Apify.CheerioCrawler({
    requestList,
    minConcurrency: 10,
    maxConcurrency: 50,
    maxRequestRetries: 1,
    handlePageTimeoutSecs: 30,
    maxRequestsPerCrawl: 10,
    handlePageFunction: greenies.handleGreeniesPageFunction(Apify),
    handleFailedRequestFunction: async ({ request }) => {
      log.debug(`Request ${request.url} failed twice.`);
    },
  });

  await crawler.run();

  const file = fs.createWriteStream("./product.csv");
  request.pipe(file);
});

console.log(convertToCsv.csv(data));
