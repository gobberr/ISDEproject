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
  let current_date = new Date();      
  let d = new Date(current_date),
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
 * from 0000 to 00:00
 * @param {*} time 
 */
function reverseParseTime(time) {    
  return (time.toString().substring(0, 2) + ':' + time.toString().substring(2, 4))
}

function setFormatTime(renderedTable) {    
  for(let i=0; i<renderedTable.length; i++) {
    if(renderedTable[i].next_lesson) {
      renderedTable[i].next_lesson[0] = reverseParseTime(renderedTable[i].next_lesson[0])
      renderedTable[i].next_lesson[1] = reverseParseTime(renderedTable[i].next_lesson[1])
    }
    if(renderedTable[i].occupied_until) {      
      renderedTable[i].occupied_until = reverseParseTime(renderedTable[i].occupied_until)
    }
  }
  return renderedTable;
}

exports.parseTime = parseTime;
exports.mergeEvents = mergeEvents;
exports.getCurrentDate = getCurrentDate;
exports.setFormatTime = setFormatTime;