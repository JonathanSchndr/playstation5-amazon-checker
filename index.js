const axios = require("axios").default;
const cheerio = require("cheerio");
const say = require("say");
const colors = require("colors");
const open = require("open");
const inquirer = require("inquirer");

const DETECTION_STRING_NOT_AVAILABLE = "Derzeit nicht verfügbar."; //OTHER COUNTRY, NEEDS A CHANGE
const AVAILABLE_MESSAGE = "Auf Lager.";

const PRODUCTS_CHOICES_TO_CHECK = [
  { name: "PS5 Drive Edition", value: "https://www.amazon.de/dp/B08H93ZRK9/" },
  {
    name: "PS5 Digital Edition",
    value: "https://www.amazon.de/dp/B08H98GVK8/",
  },
];

let BROWSER = "google chrome";

async function main() {
  try {
    let inq = await inquirer.prompt([
      {
        type: "checkbox",
        choices: PRODUCTS_CHOICES_TO_CHECK,
        message: "Choose Version(s) to check (check with spacebar)",
        name: "version",
      },
      {
        name: "interval",
        type: "number",
        message: "Interval to scrap (seconds)",
        default: 30,
      },
      {
        name: "browser",
        type: "list",
        choices: ["google chrome", "safari", "firefox"],
        message: "Which browser",
        default: "google chrome",
      },
    ]);
    BROWSER = inq.browser;

    // scrap on main run and then by interval
    inq.version.forEach(scrapProduct);
    setInterval(() => {
      inq.version.forEach(scrapProduct);
    }, inq.interval * 1000);
  } catch (error) {
    console.log("error while prompting", error);
  }
}

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
    console.error(`Error while scraping ${uri}`);
    if (
      error.response.data.includes(
        "To discuss automated access to Amazon data please contact"
      )
    ) {
      console.log(colors.red("Amazon is mad"));
    }
  } finally {
    console.log(colors.zebra(`------------`));
  }
}

main();
