

/**
 * TODO: 
 * Return the array of your day with events merged with freerooms
 * @param {*} freeRooms 
 * @param {*} events 
 */
function merge(freeRooms, events) {
  let result = [];
  result.push('Free rooms')
  result.push(freeRooms)
  result.push('Events')
  result.push(events)
  return result
}

/**
 * Return the current date 
 */
function getCurrentDate() {  
  var current_date = new Date();      
  var d = new Date(current_date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * Sleep program for n milliseconds
 * @param {*} milliseconds time to sleep
 */
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
          break;
      }
  }
}

/**
 * The from, to values received from the server are strings formatted as hh:mm:ss
 * This function converts the string in an integer that is more convenient during comparisons
 * @param {*} time 
 */
function parseTime(time) {
  var tmp = time.split(":");
  // The resulting integer will be hhmm
  return parseInt(tmp[0] + tmp[1]);
}

exports.parseTime = parseTime;
exports.merge = merge;
exports.getCurrentDate = getCurrentDate;
exports.sleep = sleep;