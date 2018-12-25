// The from, to values received from the server are strings formatted as hh:mm:ss
// This function converts the string in an integer that is more convenient during comparisons

function parseTime(time) {
  var tmp = time.split(":");
  // The resulting integer will be hhmm
  return parseInt(tmp[0] + tmp[1]);
}

function initDay() {
  let result = { 
    "0800": false,
    "0830": false,
    "0900": false,
    "0930": false,
    "1000": false,
    "1030": false,
    "1100": false,
    "1130": false,
    "1200": false,
    "1230": false,
    "1300": false,
    "1330": false,
    "1400": false,
    "1430": false,
    "1500": false,
    "1530": false,
    "1600": false,
    "1630": false,
    "1700": false,
    "1730": false,
    "1800": false,
    "1830": false,
    "1900": false,
    "1930": false,
    "2000": false,
    "2030": false,
    "2100": false,
    "2130": false,
    "2200": false,
    "2230": false,
    "2300": false,
    "2330": false,
  }
  return result;
}

function temporize(/* .... */) {
  // TODO: algoritmo di temporizzazione
}

exports.parseTime = parseTime;
exports.initDay = initDay;
exports.temporize = temporize;