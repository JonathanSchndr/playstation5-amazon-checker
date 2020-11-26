const axios = require("axios").default;
const cheerio = require("cheerio");
const say = require("say");
const colors = require("colors");
const open = require("open");

const DETECTION_STRING_NOT_AVAILABLE = "Derzeit nicht verfügbar."; //OTHER COUNTRY, NEEDS A CHANGE
const AVAILABLE_MESSAGE = "Auf Lager.";

const PLAYSTATION_DIGITAL_URL = "https://www.amazon.de/dp/B08H98GVK8/"; //OTHER COUNTRY, NEEDS A CHANGE
const PLAYSTATION_DRIVE_URL = "https://www.amazon.de/dp/B08H93ZRK9/"; //OTHER COUNTRY, NEEDS A CHANGE
const PRODUCTS_TO_CHECK = [PLAYSTATION_DRIVE_URL, PLAYSTATION_DIGITAL_URL];
const BROWSER = "google chrome";
const INTERVAL = 30000;

let isBrowserOpen = false;

setInterval(() => {
  PRODUCTS_TO_CHECK.forEach(scrapProduct);
}, INTERVAL);

async function scrapProduct(uri, i) {
  const AVAILABLE_SELECTOR = "#availability > span";

  try {
    const product_page = (
      await axios.get(uri, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36",
        },
      })
    ).data;

    const $ = cheerio.load(product_page);
    const title = $("#productTitle").text().trim();
    const price = $("#priceblock_ourprice").text().trim();
    const availableText = $(AVAILABLE_SELECTOR).text().trim();

    console.log(`Checking for ${title} `);

    if (availableText === AVAILABLE_MESSAGE) {
      console.log(colors.rainbow(`Price at: ${price} `));
      say.speak(title + AVAILABLE_MESSAGE);
      open(uri, { app: BROWSER });
    } else if (availableText === DETECTION_STRING_NOT_AVAILABLE) {
      console.log(colors.red(availableText));
    }
  } catch (error) {
    console.error(`Error while scraping ${uri}`, error);
  } finally {
    console.log(colors.zebra(`------------`));
  }
}
