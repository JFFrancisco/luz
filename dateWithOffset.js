function dateWithOffset(date) {
  const userTimezoneOffset = -(date.getTimezoneOffset() * 60000);
  return new Date(date.getTime() + userTimezoneOffset);
}

module.exports = dateWithOffset;
