const xlsx = require("xlsx");
const downloadOmie = require("./downloadOmie");
const getDate = require("./getDate");
const { handleERedes } = require("./handleERedes");

// Download Omie Data
// downloadOmie(getDate(1, 4, 2024), getDate(30, 6, 2024));

const res = handleERedes("Consumos_202406.xlsx");

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet(res);
xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

xlsx.writeFile(wb, "./output/Junho.xlsx");
