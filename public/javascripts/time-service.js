const db = require('./database-service');

/** 
 *    Flow:
 *    1.  Init an empty day object 
 *    2.  Remove time specified in events
 *    3.  Check if there are freerooms where stay in the remaining time  
 * 
 * @param {Array} freeRooms 
 * @param {Array} events 
 * @param {String} userId - googleId
 * @returns {Array} array of your day with events merged with freerooms
 */
function mergeEvents(freeRooms, events, userId) {  
  let tmp = db.setEvent(events);
  let merge = db.setFreeRooms(freeRooms, tmp);
  db.finalizeDay(userId, merge);
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
 * The from, to values received from the server are strings formatted as hh:mm:ss
 * This function converts the string in an integer that is more convenient during comparisons
 * @param {*} time 
 */
function parseTime(time) {
  let tmp = time.split(":");
  // The resulting integer will be hhmm
  return parseInt(tmp[0] + tmp[1]);
}

/**
 * TODO: test this function
 * from 0000 to 00:00
 * @param {*} time 
 */
function reverseParseTime(time) {  
  
  return (stringTime.toString().substring(1, 2) + ':' + stringTime.toString().substring(3, 4))
}

exports.parseTime = parseTime;
exports.reverseParseTime = reverseParseTime;
exports.mergeEvents = mergeEvents;
exports.getCurrentDate = getCurrentDate;