export function getOptionExpiryStatus(optionExpiryDate) {
  const currentDate = new Date();
  const targetDate = new Date(optionExpiryDate);
  const timeDifference = targetDate - currentDate;
  const differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (differenceInDays < 30 && differenceInDays >= -1) {
    return "boldAndRed";
  } else if (currentDate > targetDate) {
    return "expired";
  } else {
    return "";
  }
}

export function getFirstNoticeDayStatus(optionExpiryDate, firstNoticeDayDate) {
  const currentDate = new Date();
  const targetedDateForOE = new Date(optionExpiryDate);
  const targetedDateForFN = new Date(firstNoticeDayDate);
  const timeDifferenceForOE = targetedDateForOE - currentDate;
  const timeDifferenceForFN = targetedDateForFN - currentDate;
  const differenceInDaysForOE = Math.floor(
    timeDifferenceForOE / (1000 * 60 * 60 * 24)
  );
  const differenceInDaysForFN = Math.floor(
    timeDifferenceForFN / (1000 * 60 * 60 * 24)
  );

  if (differenceInDaysForFN < 30 && differenceInDaysForFN >= -1) {
    return "boldAndRed";
  } else if (
    currentDate > targetedDateForOE &&
    currentDate < targetedDateForFN
  ) {
    return "boldAndBlack";
  } else if (differenceInDaysForOE < 30 && differenceInDaysForOE >= 0) {
    return "boldAndBlack";
  } else if (currentDate > targetedDateForFN) {
    return "expired";
  } else {
    return "";
  }
}

export function actualValue(value) {
  if (typeof value == "string") {
    if (value.includes(" ")) {
      return parseInt(value.replace(/[^\d]/g, "").slice(1));
    } else {
      return parseFloat(value.replace(/,/g, "").replace(/s$/, ""));
    }
  } else {
    return value;
  }
}

let bufferTime = 5 * 60; // 5 min buffer time

export const checkIsMarketLive = () => {
  // bufferTime -= 1;

  const dateObject = new Date();
  const opensAt = 6 * 10000 + 30 * 100 + 0; // Opens at 12:00 PM indian timing
  const closesAt = 18 * 10000 + 30 * 100 + 0; // Closes at 12:00 AM indian timing

  function getCurrectTimeStamp() {
    return (
      dateObject.getUTCHours() * 10000 +
      dateObject.getUTCMinutes() * 100 +
      dateObject.getUTCSeconds()
    );
  }

  const currentTimeStamp = getCurrectTimeStamp();

  const day = dateObject.getDay();
  const isWeekend = day === 0 || day === 6;

  // if (bufferTime >= 0) {
  //   return true;
  // }

  // if (isWeekend) {
  //   return false;
  // }

  return true;

  // For reference (This below code is to restrict api call in the market off hour)
  // if (currentTimeStamp >= opensAt && currentTimeStamp <= closesAt) {
  //   return true;
  // } else {
  //   return false;
  // }
};

export function indianFormatedDataAndTime(dateAndTime) {
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  const [datePart, timePart] = new Intl.DateTimeFormat("en-GB", options)
    .format(dateAndTime)
    .split(", ");
  const [day, month, year] = datePart.split("/");

  const milliseconds = dateAndTime
    .getMilliseconds()
    .toString()
    .padStart(3, "0");

  const formattedIST = `${year}-${month}-${day}T${timePart}.${milliseconds}`;

  return formattedIST;
}

export function getBadgeColorCode(previousEntryTime, currentTimeStamp) {
  const timestamp1 = new Date(previousEntryTime);
  const timestamp2 = new Date(currentTimeStamp);
  const differenceInMilliseconds = timestamp2 - timestamp1;

  function getColorBasedOnTimeDifference(diff) {
    const intervals = [1000, 1500, 2000, 2500, 3000, 3500, 4000];

    const colors = [
      "#00FF00",
      "#00FF00",
      "#ffdd03",
      "#ffdd03",
      "#ff9e03",
      "#ff5b03",
      "#FF0000"
    ];

    for (let i = 0; i < intervals.length; i++) {
      if (diff <= intervals[i]) {
        return colors[i];
      }
    }

    return colors[colors.length - 1];
  }

  return getColorBasedOnTimeDifference(differenceInMilliseconds);
}
