const handleGreeniesPageFunction = (Apify) => async ({ request, $ }) => {
  const title = $(".title h1").text();
  const description = $(".desc").text();
  const ingredients = $("#ingredients").text().trim();
  let variants = [];
  $("#product-pack-sizes")
    .children(".btn-container")
    .each(function (i, element) {
      const prodCount = $(element).find(".product-pack-count").text();
      const prodWeight = $(element).find(".product-pack-weight").text();

      return variants.push(`${prodCount} ${prodWeight}`);
    });

  const product = { title, description, ingredients, variants };

  await Apify.pushData(product);
};

exports.handleGreeniesPageFunction = handleGreeniesPageFunction;
