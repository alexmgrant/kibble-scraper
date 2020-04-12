const Apify = require("Apify");
const { log, enqueueLinks } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);

const rootUrl = "https://worldpostalcode.com/canada/ontario/";
const urlList = [
  "ajax",
  "algoma",
  "ancaster",
  "barrie",
  "belleville",
  "bowmanville",
  "brampton",
  "brant",
  "burlington",
  "cambridge",
  "chatham",
  "cornwall",
  "dufferin-county",
  "frontenac-county",
  "gloucester",
  "greater-sudbury",
  "guelph",
  "halton",
  "hamilton",
  "kanata",
  "kingston",
  "kitchener",
  "la-salle",
  "lake-simcoe",
  "lake-superior",
  "london",
  "markham",
  "nepean",
  "newmarket",
  "niagara-falls",
  "nipissing",
  "north-bay",
  "oakville",
  "orangeville",
  "oshawa",
  "ottawa",
  "parry-sound",
  "pembroke",
  "peterborough",
  "peterborough-county",
  "pickering",
  "renfrew-county",
  "sarnia",
  "sault-ste",
  "st-catharines",
  "st-thomas",
  "tecumseh",
  "thunder-bay",
  "timiskaming",
  "timmins",
  "waterloo",
  "welland",
  "whitby",
  "willowdale",
  "windsor",
  "woodbridge",
  "woodstock",
];
const buildUrlList = (urlList) => urlList.map((path) => buildUrl(path));
const buildUrl = (path) => ({ url: `${rootUrl}${path}` });

Apify.main(async () => {
  const requestList = await Apify.openRequestList(
    "ontario-postal-codes",
    buildUrlList(urlList)
  );

  const crawler = new Apify.CheerioCrawler({
    requestList,
    handlePageFunction: async ({ request, response, body, contentType, $ }) => {
      let data = "";

      $(".units").each((index, el) => {
        $(el)
          .children()
          .each(
            (i, el) =>
              (data = data.concat(`${$(el).find(".code span").text()}, `))
          );
      });

      // Save the data to dataset.
      await Apify.pushData({
        url: request.url,
        data,
      });
    },
  });

  await crawler.run();

  const dataSet = await Apify.openDataset();
  const allCodes = await dataSet.map((item) => item.data);

  log.debug(allCodes);
});
