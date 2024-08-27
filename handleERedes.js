const xlsx = require("xlsx");
const fs = require("fs");
const { format } = require("date-fns/format");
const dateWithOffset = require("./dateWithOffset");
const { toKw, toMWh, toEuro, toEuroPerMWh } = require("./valueFormat");

function handleERedes(filename) {
  const workbook = xlsx.readFile(`./eRedes/${filename}`);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonSheet = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const data = jsonSheet.slice(15);

  let rowGroup = 0;

  let injeccaoICTotal = 0;
  let injeccaoICMWhTotal = 0;
  let injeccaoICEuroTotal = 0;
  let injeccaoRegistadaTotal = 0;
  let injeccaoRegistadaMWhTotal = 0;
  let injeccaoRegistadaEuroTotal = 0;

  const eRedesData = [];
  data.forEach((row, index) => {
    const date = new dateWithOffset(new Date(row[0])).toLocaleDateString();

    const hour = (rowGroup % 24) + 1;

    const injeccaoIC = Number(row[4]);
    const injeccaoICMWh = (Number(row[4]) / 1000) * 0.25;
    const injeccaoRegistada = Number(row[8]);
    const injeccaoRegistadaMWh = (Number(row[8]) / 1000) * 0.25;

    if (index % 4 === 0) {
      let omieValue;
      try {
        const omie = fs.readFileSync(
          `./omie/omie_${format(date, "yyyyMMdd")}.txt`,
          "utf8"
        );

        omieValue = Number(
          omie.split(/\r?\n/).slice(1)[hour - 1].split(";")[4]
        );
      } catch (err) {
        console.error("Error reading file:", err);
      }
      eRedesData.push([
        date,
        hour,
        omieValue,
        injeccaoIC,
        injeccaoICMWh,
        0,
        injeccaoRegistada,
        injeccaoRegistadaMWh,
        0,
      ]);
    } else {
      eRedesData[rowGroup][3] += injeccaoIC;
      eRedesData[rowGroup][4] += injeccaoICMWh;
      eRedesData[rowGroup][6] += injeccaoRegistada;
      eRedesData[rowGroup][7] += injeccaoRegistadaMWh;
    }
    if (index % 4 === 3) {
      const icEuro = eRedesData[rowGroup][2] * eRedesData[rowGroup][4];
      const registadaEuro = eRedesData[rowGroup][2] * eRedesData[rowGroup][7];
      eRedesData[rowGroup][5] = toEuro(icEuro);
      eRedesData[rowGroup][8] = toEuro(registadaEuro);

      injeccaoICTotal += eRedesData[rowGroup][3];
      injeccaoICMWhTotal += eRedesData[rowGroup][4];
      injeccaoICEuroTotal += icEuro;
      injeccaoRegistadaTotal += eRedesData[rowGroup][6];
      injeccaoRegistadaMWhTotal += eRedesData[rowGroup][7];
      injeccaoRegistadaEuroTotal += registadaEuro;

      eRedesData[rowGroup][2] = toEuroPerMWh(eRedesData[rowGroup][2]);
      eRedesData[rowGroup][3] = toKw(eRedesData[rowGroup][3]);
      eRedesData[rowGroup][4] = toMWh(eRedesData[rowGroup][4]);
      eRedesData[rowGroup][6] = toKw(eRedesData[rowGroup][6]);
      eRedesData[rowGroup][7] = toMWh(eRedesData[rowGroup][7]);

      rowGroup++;
    }
  });

  eRedesData.unshift([
    "Data",
    "Hora",
    "Marginal price Portuguese system (€/MWh)",
    "Injeção na rede medida na IC, Ativa (kW)",
    "Injeção na rede medida na IC, Ativa (MWh)",
    "Injeção na rede medida na IC, Ativa (€)",
    "Injeção registada (kW)",
    "Injeção registada (MWh)",
    "Injeção registada (€)",
  ]);

  eRedesData.push([
    "Total",
    "",
    "",
    toKw(injeccaoICTotal),
    toMWh(injeccaoICMWhTotal),
    toEuro(injeccaoICEuroTotal),
    toKw(injeccaoRegistadaTotal),
    toMWh(injeccaoRegistadaMWhTotal),
    toEuro(injeccaoRegistadaEuroTotal),
  ]);
  return eRedesData;
}
module.exports = { handleERedes };
