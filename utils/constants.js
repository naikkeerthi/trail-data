export let tincapheLoginPayload = {
  grant_type: "password",
  client_id: "APP",
  usernameOrEmailAddress: "Integrated3", // DEVELOPMENT CREDENTIALS
  password: "7979", // // DEVELOPMENT CREDENTIALS
  tenancyName: "Default",
  rememberMe: false,
};

export const activeXECurrency = [
  {
    id: 1,
    currencyName: "USD/INR",
    fxcurrencyType: 0,
    rowId: "49d26c9b-3f1b-44c0-877f-5c93355e0555",
  },
  {
    id: 2,
    currencyName: "USD/BRL",
    rowId: "7ea02d36-55c0-4c43-b49e-f49e6703b5e3",
    fxcurrencyType: 1,
  },
  {
    id: 3,
    currencyName: "USD/VND",
    rowId: "39cf70bf-cd01-4092-ae37-bb29850f900b",
    fxcurrencyType: 2,
  },
];

export let devApi = {
  getActiveTerminalDetailsFromDev:
    "https://dev-api.devptest.com/api/TerminalDetails/GetTerminalDetails",
  getActiveTerminalDetailsFromProd:
    "https://coffeequotes.coffeewebapi.com/api/Terminaldetails/GetTerminalDetails",
  insertTincapheDataToDev:
    "https://dev-api.devptest.com/api/TincapheAuth/InsertTincapheData",
  insertTincapheDataToProd:
    "https://coffeewebtrail-api.coffeewebapi.com/api/TincapheAuth/InsertTincapheData",
  insertXECurrencyToDev:
    "https://dev-api.devptest.com/api/CoffeeQuotesCurrency/PostcoffeequotesCurrency",
  insertXECurrencyToProd:
    "https://coffeewebtrail-api.coffeewebapi.com/api/CoffeeQuotesCurrency/PostcoffeequotesCurrency",
  getCommodityDetailsFromDev:
    "https://dev-commodities-trl-linux-api-bmfqd9cdbghxh5b7.centralindia-01.azurewebsites.net/api/IceMarketPublish/GetAllCommodityList",
  getCommodityDetailsFromProd:
    "https://coffeeweb-commodities-linux-api-cpdbf4bmhuh0evd3.southindia-01.azurewebsites.net/api/IceMarketPublish/GetAllCommodityList",
  insertTrialCommodityDataToDev:
    "https://dev-commodities-trl-linux-api-bmfqd9cdbghxh5b7.centralindia-01.azurewebsites.net/api/IceMarketPublish/PostTrialCommodityData",
  insertTrialCommodityDataToProd:
    "https://coffeeweb-commodities-linux-api-cpdbf4bmhuh0evd3.southindia-01.azurewebsites.net/api/IceMarketPublish/PostTrialCommodityData",
};

export let tincapheApi = {
  authenticate: "http://tincaphe.com//api/account/authenticate",
  getTincapheData:
    "http://tincaphe.com/api/services/app/priceTableClient/GetValues",
};

export const commodities = [
  {
    id: "2aa0138d-a3e8-4a22-b7a9-1b7d338d2f62",
    name: "Gold",
  },
  // Remove the below object if not required, as it was added to demo multiple commodities
  {
    id: "886db8be-e935-4d67-9160-6beb413b5a9f",
    name: "Crude-Oil", // Element 39 c:'Index'
  },
];
