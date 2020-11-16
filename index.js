const request = require("request");
const cheerio = require("cheerio");
const say = require("say")

const DETECTION_STRING_NOT_AVAILABLE = "Derzeit nicht verfügbar."; //OTHER COUNTRY, NEEDS A CHANGE
const PLAYSTATION_DIGITAL_URL = "https://www.amazon.de/Sony-PlayStation-5-Digital-Edition/dp/B08H98GVK8/"; //OTHER COUNTRY, NEEDS A CHANGE
const PLAYSTATION_DRIVE_URL = "https://www.amazon.de/Sony-Interactive-Entertainment-PlayStation-5/dp/B08H93ZRK9/"; //OTHER COUNTRY, NEEDS A CHANGE
const INTERVAL = 10000;
const AVAILABLE_MESSAGE = " ist auf Amazon verfügbar!";

setInterval(() => {

  request({
    uri: PLAYSTATION_DIGITAL_URL
  }, function (error, response, body) {
    var $ = cheerio.load(body);
    var availbleDigital = $("#availability > span").text().indexOf(DETECTION_STRING_NOT_AVAILABLE);
    var productNameDigital = $("#productTitle").text();
    if (availbleDigital < 0 && productNameDigital != "") say.speak(productNameDigital + AVAILABLE_MESSAGE);
  });

  request({
    uri: PLAYSTATION_DRIVE_URL
  }, function (error, response, body) {
    var $ = cheerio.load(body);
    var availbleDrive = $("#availability > span").text().indexOf(DETECTION_STRING_NOT_AVAILABLE);
    var productNameDrive = $("#productTitle").text();
    if (availbleDrive < 0 && productNameDigital != "") say.speak(productNameDrive + AVAILABLE_MESSAGE);
  });

}, INTERVAL);