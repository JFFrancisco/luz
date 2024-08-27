const dateWithOffset = require("./dateWithOffset");

function getDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return dateWithOffset(date);
}

module.exports = getDate;
