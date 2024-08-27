function toKw(value) {
  return `${value.toFixed(2)} kW`;
}
function toMWh(value) {
  return `${value.toFixed(2)} MWh`;
}

function toEuro(value) {
  return `${value.toFixed(2)} €`;
}

function toEuroPerMWh(value) {
  return `${value.toFixed(2)} €/MWh`;
}

module.exports = { toKw, toMWh, toEuro, toEuroPerMWh };
