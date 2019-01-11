const Day = require('../../models/day-model');
const time = require('./time-service');

const time_slot = [
    '0800',
    '0830',
    '0900',
    '0930',
    '1000',
    '1030',
    '1100',
    '1130',
    '1200',
    '1230',
    '1300',
    '1330',
    '1400',
    '1430',
    '1500',
    '1530',
    '1600',
    '1630',
    '1700',
    '1730',
    '1800',
    '1830',
    '1900',
    '1930',
    '2000',
    '2030',
    '2100',
    '2130',
    '2200',
    '2230',
    '2300',
    '2330',
    '2400'
]


/**
 * Initialize day object
 * @param {String} userId - google user id
 */
function initDay(userId) {
      
  console.log('initDay')
  let currentDate = time.getCurrentDate();
  console.log('currentDate: ' + currentDate)
  
  // create a new object
  new Day({
    googleId: userId,
    date: currentDate,  
    slot_day: createEmptySlotDay()
  }).save()
}

/**
 * Deleted field of this day of userId in the day-model 
 * @param {*} userId 
 */
function deleteMergedDay(userId) {
  // delete object if already exist
  let currentDate = time.getCurrentDate();
  Day.deleteMany({ googleId: userId, date: currentDate }, function(err, result) {            
    if(err) console.log(err) 
    console.log('clean completed successfully')        
  });
}

/**
 * Return the planned day
 * @param {*} userId - google user id
 * @returns {Object} - to render in the frontend
 */
function getMergedDay(userId) {
  
  console.log('getMergedDay')  
  let currentDate = time.getCurrentDate();
  result = Day.find({ googleId: userId, date: currentDate });
  return result;
}

function setEvent(events) {  
  console.log('setEvent')
  //console.log(events)
}

function setFreeRooms(freeRooms) {
  console.log('setFreeRooms')
  //console.log(freeRooms)
}



function createEmptySlotDay() {
    return [{ start_slot: '0900', end_slot: '0930', event: 'Prova', freeRooms: [1,2,3]}]
}

exports.initDay = initDay;
exports.setEvent = setEvent;
exports.setFreeRooms = setFreeRooms;
exports.getMergedDay = getMergedDay;
exports.deleteMergedDay = deleteMergedDay;