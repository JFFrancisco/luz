const https = require("https");
const fs = require("fs");
const { differenceInDays } = require("date-fns/differenceInDays");
const { add } = require("date-fns/add");
const { format } = require("date-fns/format");

function downloadOmie(from, to) {
  const numDays = differenceInDays(to, from);
  for (let day = 0; day <= numDays; day++) {
    const formattedDate = format(add(from, { days: day }), "yyyyMMdd");

    const path = `./omie/omie_${formattedDate}.txt`;
    const url = `https://www.omie.es/pt/file-download?parents%5B0%5D=marginalpdbcpt&filename=marginalpdbcpt_${formattedDate}.1`;

    const file = fs.createWriteStream(path);
    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log("Download completed.");
        });
      })
      .on("error", (err) => {
        fs.unlink(path, () => {});
        console.error("Error downloading file:", err.message);
      });
  }
}

module.exports = downloadOmie;
