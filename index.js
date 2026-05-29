import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import cors from "cors";
import tough from "tough-cookie";
import fetch from "node-fetch";
import express from "express";
import path from "path";
import status from "express-status-monitor";
import { fileURLToPath } from "url";
import mobileMenuRoute from "./routes/mobileMenuRoute.js";
import {
  getOptionExpiryStatus,
  getFirstNoticeDayStatus,
  actualValue,
  indianFormatedDataAndTime,
  getBadgeColorCode,
} from "./utils/commonMethods.js";
import {
  devApi,
  tincapheApi,
  tincapheLoginPayload,
  activeXECurrency,
  commodities,
} from "./utils/constants.js";
import { EventHubProducerClient } from "@azure/event-hubs";

const app = express();
app.use(express.json());
app.use(status());
app.use(cors({ origin: "*" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cookieJar = new tough.CookieJar();

let prevGoldPriceData;
let prevCommodityData = [];
let prevDollerIndexData;
let isMarketOn = true;
let generatedTokenForAuthenticate = "";
let activeTerminalsForDev = [];
let activeTerminalsForProd = [];

let commoditiesList = [];

let lastUpdatedDateAndTimeForDev = null;
let lastUpdatedDateAndTimeForProd = null;

let latencyForColorCodeForDev = null;
let latencyForColorCodeForProd = null;

const connectionString = process.env.AZURE_EVENT_HUB_CONNECTION_STRING;
const producer = new EventHubProducerClient(connectionString);

// Initial call made to get retrive the active terminals from our local DB
getActiveTerminalDetails(devApi.getActiveTerminalDetailsFromDev, "DEV");
getActiveTerminalDetails(devApi.getActiveTerminalDetailsFromProd, "PROD");

// Initial call made to get retrieve the commodities list
getAllCommodityList(devApi.getCommodityDetailsFromDev, "DEV");
getAllCommodityList(devApi.getCommodityDetailsFromProd, "PROD");

// Fetch (scarp) market live prices for tincaphe website
setInterval(() => {
  getTermincalDataFromTincaphe();
}, 1000);

// Fetch active terminals our local DB
setInterval(() => {
  getActiveTerminalDetails(devApi.getActiveTerminalDetailsFromDev, "DEV");
  getActiveTerminalDetails(devApi.getActiveTerminalDetailsFromProd, "PROD");
}, 15000);

// Push XE currency to local DB
setInterval(() => {
  getXECurrencyDataFromTincaphe();
}, 15000);

const api = axios.create({
  withCredentials: true,
  jar: cookieJar,
});

// Function to retrive live prices from tincaphe
function getTermincalDataFromTincaphe() {
  let token = generatedTokenForAuthenticate;
  api.defaults.headers["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  api
    .post(tincapheApi.getTincapheData)
    .then((response) => {
      const tincapheResponse = response.data.result;

      const processData = (activeTerminals) => {
        let modifiedData = [];
        for (let i = 0; i < activeTerminals.length; i++) {
          let tincapheObject = tincapheResponse?.find(
            ({ id }) => activeTerminals[i].terminalId === id,
          );

          if (tincapheObject) {
            const {
              idMarket,
              contractName,
              optionExpiry,
              optionExpiryDateFormat,
              firstNoticeDay,
              firstNoticeDayDateFormat,
              terminalId,
              _52weeksHighRate,
              _52weeksLowRate,
              _52weeksHighDate,
              _52weeksLowDate,
            } = activeTerminals[i];
            const object = {
              isHighlight: 0,
              id: i,
              createdBy: 1,
              createdOn: new Date(),
              updatedBy: 1,
              updatedDtms: new Date(),
              idMarket,
              contractName,
              lastChng: actualValue(tincapheObject.vs[1]) || 0,
              chng: actualValue(tincapheObject.vs[2]) || 0,
              percentageVal: actualValue(tincapheObject.vs[3]),
              volume: actualValue(tincapheObject.vs[4]),
              highRate: actualValue(tincapheObject.vs[6]),
              highRateCurrency: 0,
              lowRate: actualValue(tincapheObject.vs[7]),
              lowRateCurrency: 0,
              openRate: actualValue(tincapheObject.vs[8]),
              prevRate: actualValue(tincapheObject.vs[9]),
              openInterest: tincapheObject.vs[10],
              bid: tincapheObject.vs[11],
              bsize: tincapheObject.vs[12],
              ask: tincapheObject.vs[13],
              asize: tincapheObject.vs[14],
              optionExpiry,
              optionExpiryStatus: getOptionExpiryStatus(optionExpiryDateFormat),
              firstNoticeDate: firstNoticeDay,
              firstNoticeDateStatus: getFirstNoticeDayStatus(
                optionExpiryDateFormat,
                firstNoticeDayDateFormat,
              ),
              highCurrency: 0,
              lowCurrency: 0,
              marketName: contractName,
              userSymbolId: 0,
              orderBy: 0,
              terminalId,
              contractHighRate: _52weeksHighRate,
              contractLowRate: _52weeksLowRate,
              contractHighDate: _52weeksHighDate,
              contractLowDate: _52weeksLowDate,
            };

            modifiedData.push(object);
          }
        }

        return modifiedData;
      };

      const processedDataForDev = processData(activeTerminalsForDev);
      const processedDataForProd = processData(activeTerminalsForProd);

      if (isMarketOn) {
        postTincapheData(
          devApi.insertTincapheDataToDev,
          processedDataForDev,
          "DEV",
        );
      }

      postTincapheData(
        devApi.insertTincapheDataToProd,
        processedDataForProd,
        "PROD",
      );

      updateDollerIndexToAzureEventHub(tincapheResponse);
      updateCommoditiesFromTincaphe(tincapheResponse);
    })
    .catch(() => {
      console.error("Failed to get tincaphe data!");
      generateValidTokenForTincaphe();
    });
}

// Generate the token from tincaphe
function generateValidTokenForTincaphe() {
  api.defaults.headers["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
  api
    .post(tincapheApi.authenticate, tincapheLoginPayload)
    .then((response) => {
      generatedTokenForAuthenticate = response?.data?.result?.access_token;
      console.log(
        "generatedTokenForAuthenticate",
        generatedTokenForAuthenticate,
      );
    })
    .catch(() => {
      console.error("Failed to generate tincaphe token!");
    });
}

// Update the doller index currency into Azure Event hub
async function updateDollerIndexToAzureEventHub(tincapheResponse) {
  try {
    const dollerIndexCurrency = tincapheResponse.find(
      (ele) => ele.id === "ff5c8d83-de1d-4aab-aa25-b11d097cdb56",
    );

    const parsedData = {
      lastChng: actualValue(dollerIndexCurrency.vs[1]) || 0,
      chng: actualValue(dollerIndexCurrency.vs[2]) || 0,
      percentageVal: actualValue(dollerIndexCurrency.vs[3]),
      volume: actualValue(dollerIndexCurrency.vs[4]),
      highRate: actualValue(dollerIndexCurrency.vs[6]),
      highRateCurrency: 0,
      lowRate: actualValue(dollerIndexCurrency.vs[7]),
      lowRateCurrency: 0,
      openRate: actualValue(dollerIndexCurrency.vs[8]),
      prevRate: actualValue(dollerIndexCurrency.vs[9]),
      openInterest: dollerIndexCurrency.vs[10],
      bid: dollerIndexCurrency.vs[11],
      bsize: dollerIndexCurrency.vs[12],
      ask: dollerIndexCurrency.vs[13],
      asize: dollerIndexCurrency.vs[14],
    };

    const isSameData =
      JSON.stringify(parsedData) === JSON.stringify(prevDollerIndexData);

    if (dollerIndexCurrency && !isSameData) {
      prevDollerIndexData = parsedData;
      const batch = await producer.createBatch();
      batch.tryAdd({ body: parsedData });
      await producer.sendBatch(batch);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

function buildCommodityPayload(tincapheResponse) {
  return commoditiesList
    .map((commodity) => {
      const commodityPrice = tincapheResponse.find(
        (ele) => ele.id === commodity.commodityId,
      );
      if (!commodityPrice) return null;
      return [
        {
          commodityName: String(commodity.commodityName),
          close: String(commodityPrice.vs[0]),
          last: String(commodityPrice.vs[1]),
          chng: String(commodityPrice.vs[2]),
          percentageVal: String(commodityPrice.vs[3]),
          volume: String(commodityPrice.vs[4]),
          highRate: String(commodityPrice.vs[6]),
          lowRate: String(commodityPrice.vs[7]),
          openRate: String(commodityPrice.vs[8]),
          prevRate: String(commodityPrice.vs[9]),
          openInterest: String(commodityPrice.vs[10]),
          bid: String(commodityPrice.vs[11]),
          bsize: String(commodityPrice.vs[12]),
          ask: String(commodityPrice.vs[13]),
          asize: String(commodityPrice.vs[14]),
        },
      ];
    })
    .filter(Boolean);
}

function updateCommoditiesFromTincaphe(tincapheResponse) {
  try {
    const commodityPayload = buildCommodityPayload(tincapheResponse);
    if (!commodityPayload.length) return;

    const isSameData =
      JSON.stringify(commodityPayload) === JSON.stringify(prevCommodityData);
    if (!isSameData) {
      prevCommodityData = commodityPayload;

      postCommodityData(commodityPayload, "DEV");
      postCommodityData(commodityPayload, "PROD");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function postCommodityData(commodityPayload, environment) {
  const URL =
    environment === "DEV"
      ? devApi.insertTrialCommodityDataToDev
      : devApi.insertTrialCommodityDataToProd;

  const requests = commodityPayload.map((commodity) =>
    fetch(URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "accept-language": "en_US",
        "content-type": "application/json",
      },
      body: JSON.stringify(commodity),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      return response.json();
    }),
  );

  console.log(
    "Commodity data posted to ",
    environment,
    " with payload: ",
    commodityPayload,
  );
}

// Insert the modified tincaphe data into out local DB
function postTincapheData(URL, modifiedData, environment) {
  fetch(URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "accept-language": "en_US",
      "content-type": "application/json",
    },
    body: JSON.stringify(modifiedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      return response.json();
    })
    .then(() => {
      console.log(`${environment} done...`);
      let currentEntryTime = indianFormatedDataAndTime(new Date());

      if (environment === "DEV") {
        latencyForColorCodeForDev = getBadgeColorCode(
          lastUpdatedDateAndTimeForDev,
          currentEntryTime,
        );
        lastUpdatedDateAndTimeForDev = currentEntryTime;
      } else {
        latencyForColorCodeForProd = getBadgeColorCode(
          lastUpdatedDateAndTimeForProd,
          currentEntryTime,
        );
        lastUpdatedDateAndTimeForProd = currentEntryTime;
      }
    })
    .catch((error) => {
      console.error(`${environment} error`, error.message);
    });
}

// Get active terminals from our Local DB
function getActiveTerminalDetails(URL, environment) {
  fetch(URL, {
    method: "get",
    headers: {
      accept: "application/json",
      "accept-language": "en_US",
      "content-type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response?.returnLst?.length > 0 && environment === "DEV") {
        activeTerminalsForDev = response?.returnLst;
      }
      if (response?.returnLst?.length > 0 && environment === "PROD") {
        activeTerminalsForProd = response?.returnLst;
      }
      console.log(`received active terminals from ${environment}`);
    })
    .catch((error) => {
      console.error("error", error);
    });
}

// Get XE currency from Tincaphe
function getXECurrencyDataFromTincaphe() {
  let token = generatedTokenForAuthenticate;
  api.defaults.headers["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  api
    .post(tincapheApi.getTincapheData)
    .then((response) => {
      const processCurrencyData = () => {
        let xeArray = [];
        const tincapheXEcurrencyResponse = response.data.result;

        for (let i = 0; i < activeXECurrency?.length; i++) {
          let tincapheObject = tincapheXEcurrencyResponse.find(
            (ele) => ele.id === activeXECurrency[i].rowId,
          );

          if (tincapheObject) {
            const object = {
              currencyName: activeXECurrency[i].currencyName,
              last: actualValue(tincapheObject.vs[1]),
              flagUrl: "",
              chng: tincapheObject.vs[2],
              percentageVal: tincapheObject.vs[3],
              fxcurrencyType: activeXECurrency[i].fxcurrencyType,
            };

            xeArray.push(object);
          }
        }

        return xeArray;
      };

      const processedCurrencyDataForDev = processCurrencyData();
      const processedCurrencyDataForProd = processCurrencyData();

      postXECurrency(
        devApi.insertXECurrencyToDev,
        processedCurrencyDataForDev,
        "DEV",
      );
      postXECurrency(
        devApi.insertXECurrencyToProd,
        processedCurrencyDataForProd,
        "PROD",
      );
    })
    .catch((error) => {
      console.error("Error while fetching data:", error.message);
    });
}

// Post XE currency it into our local DB
function postXECurrency(URL, xeArray, environment) {
  fetch(URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "accept-language": "en_US",
      "content-type": "application/json",
    },
    body: JSON.stringify(xeArray),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      return response.json();
    })
    .then(() => {
      console.log(`${environment} XE done for DEV`);
    })
    .catch((error) => {
      console.error("error", error.message);
    });
}

function getAllCommodityList(URL, environment) {
  fetch(URL, {
    method: "get",
    headers: {
      accept: "application/json",
      "accept-language": "en_US",
      "content-type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response?.returnLst?.length > 0 && environment === "DEV") {
        commoditiesList = response?.returnLst;
      }
      if (response?.returnLst?.length > 0 && environment === "PROD") {
        commoditiesList = response?.returnLst;
      }
      console.log(`received active commodities from ${environment}`);
    })
    .catch((error) => {
      console.error("error", error);
    });
}

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/get-condition", (_, res) => {
  res.json({ isMarketOn });
});

app.post("/toggle-condition", express.json(), (req, res) => {
  isMarketOn = req.body.isMarketOn;
  res.json({ success: true, isMarketOn });
});

app.get("/get-lastUpdated-date-time", (_, res) => {
  res.json({
    lastUpdatedDateAndTimeForDev,
    lastUpdatedDateAndTimeForProd,
    isMarketOn,
    latencyForColorCodeForDev,
    latencyForColorCodeForProd,
  });
});

//firebase remote config route for mobile menus
app.use("/api/remote-config", mobileMenuRoute);

app.listen(process.env.PORT, async () => {
  try {
    console.log("server is running on port:", process.env.PORT);
  } catch (error) {
    console.log("failed to start the server", error.message);
  }
});
