const Day = require('../../models/day-model');
const time = require('./time-service');

/**
 * Deleted field of this day of userId in the day-model 
 * @param {*} userId 
 */
function deleteMergedDay(userId) {
  // delete object if already exist
  let currentDate = time.getCurrentDate();
  Day.deleteMany({ googleId: userId, date: currentDate }, function(err, result) {            
    if(err) console.log(err) 
    //console.log('clean completed successfully')        
  });
}

/**
 * Initialize day object
 * @param {String} userId - google user id
 */
function finalizeDay(userId, mergedDay) {      
  let currentDate = time.getCurrentDate();  
  // create a new object and save it
  new Day({
    googleId: userId,
    date: currentDate,  
    slot_day: mergedDay
  }).save()
}

/**
 * Create a new slot for each day section. Then push the events in the slot
 * @param {*} events - google user id
 * @returns {Array} - array of slot with events
 */
function setEvent(events) {    
  let emptySlot = createEmptySlotDay()  
  for(let i=0; i<events.length; i++) {    
    for(let j=0; j<emptySlot.length; j++) {         
      // check if event start or finish in this slot
      if(time.parseTime(events[i].start_time) == time.parseTime(emptySlot[j].start_slot) || (time.parseTime(events[i].end_time) == time.parseTime(emptySlot[j].end_slot))) {        
        emptySlot[j].event = events[i].title;
      }
      // check if event include other slot in the middle
      if(time.parseTime(events[i].start_time) <= time.parseTime(emptySlot[j].start_slot) && (time.parseTime(events[i].end_time) >= time.parseTime(emptySlot[j].end_slot))) {        
        emptySlot[j].event = events[i].title;
      }
    }
  }  
  return emptySlot;
}

/** 
 * Create a new slot for each day section. Then push the events in the slot
 * @param {*} freeRooms - object that rapresent free rooms in povo
 * @param {tempDay} tempDay - object to integrate with free rooms
 * @returns {Array} - array of slot with merged day
 */
function setFreeRooms(freeRooms, tempDay) {  
  for(let i=0; i<tempDay.length; i++) {
    tempDay[i].freeRooms = getFreeRoomInSlot(freeRooms, time.parseTime(tempDay[i].start_slot), time.parseTime(tempDay[i].end_slot));
  }
  return tempDay
}

function getFreeRoomInSlot(freeRooms, from, to) {
  let arrayRoom = [];
  for(let i=0; i<freeRooms.length; i++) {
    if(isRoomFreeInSlot(freeRooms[i], from, to)) {      
      arrayRoom.push(freeRooms[i].code.substring(6,10))
    }
  }
  return arrayRoom;
}

/**
 * @param {*} room - object room
 * @param {*} from - time in format hhmm of start slot
 * @param {*} to - time in format hhmm of end slot
 */
function isRoomFreeInSlot(room, from, to) {
  
  let result = false;
  if((room.occupied == true) && (room.next_lesson == null)) {
    // se l'aula si libera prima che inizi lo slot true
    // console.log('room: ' + room.code + ' is free after ' + room.occupied_until)
    if(room.occupied_until < from) {
      result = true;
    }
  } else if ((room.occupied == false) && (room.next_lesson == null)) {
    // se l'aula è libera tutto il giorno true
    // console.log('room: ' + room.code + ' is free all day')
    result = true;
  } else if ((room.occupied == false) && (room.next_lesson != null)) {
    // se lo slot finisce prima che cominci o inizia dopo che è finita la lezione true  
    // console.log('room: ' + room.code + ' is free until ' + room.next_lesson[0] )    
    if((to < room.next_lesson[0]) || from > room.next_lesson[1]) { 
      result = true;
    }
  } 

  return result;
}

/**
 *  Object factory: initialize an array of day, from 8:00 to 22:00
 */
function createEmptySlotDay() {
    return [
      { start_slot: '08:00', end_slot: '08:30', event: '', freeRooms: [] },
      { start_slot: '08:30', end_slot: '09:00', event: '', freeRooms: [] },
      { start_slot: '09:00', end_slot: '09:30', event: '', freeRooms: [] },
      { start_slot: '09:30', end_slot: '10:00', event: '', freeRooms: [] },
      { start_slot: '10:00', end_slot: '10:30', event: '', freeRooms: [] },
      { start_slot: '10:30', end_slot: '11:00', event: '', freeRooms: [] },
      { start_slot: '11:00', end_slot: '11:30', event: '', freeRooms: [] },
      { start_slot: '11:30', end_slot: '12:00', event: '', freeRooms: [] },
      { start_slot: '12:00', end_slot: '12:30', event: '', freeRooms: [] },
      { start_slot: '12:30', end_slot: '13:00', event: '', freeRooms: [] },
      { start_slot: '13:00', end_slot: '13:30', event: '', freeRooms: [] },
      { start_slot: '13:30', end_slot: '14:00', event: '', freeRooms: [] },
      { start_slot: '13:00', end_slot: '13:30', event: '', freeRooms: [] },
      { start_slot: '13:30', end_slot: '14:00', event: '', freeRooms: [] },
      { start_slot: '14:00', end_slot: '14:30', event: '', freeRooms: [] },
      { start_slot: '14:30', end_slot: '15:00', event: '', freeRooms: [] },
      { start_slot: '15:00', end_slot: '15:30', event: '', freeRooms: [] },
      { start_slot: '15:30', end_slot: '16:00', event: '', freeRooms: [] },
      { start_slot: '16:00', end_slot: '16:30', event: '', freeRooms: [] },
      { start_slot: '16:30', end_slot: '17:00', event: '', freeRooms: [] },
      { start_slot: '17:00', end_slot: '17:30', event: '', freeRooms: [] },
      { start_slot: '17:30', end_slot: '18:00', event: '', freeRooms: [] },
      { start_slot: '18:00', end_slot: '18:30', event: '', freeRooms: [] },
      { start_slot: '18:30', end_slot: '19:00', event: '', freeRooms: [] },
      { start_slot: '19:00', end_slot: '19:30', event: '', freeRooms: [] },
      { start_slot: '19:30', end_slot: '20:00', event: '', freeRooms: [] },
      { start_slot: '20:00', end_slot: '20:30', event: '', freeRooms: [] },
      { start_slot: '20:30', end_slot: '21:00', event: '', freeRooms: [] },
      { start_slot: '21:00', end_slot: '21:30', event: '', freeRooms: [] },
      { start_slot: '21:30', end_slot: '22:00', event: '', freeRooms: [] }
    ]
}

exports.finalizeDay = finalizeDay;
exports.setEvent = setEvent;
exports.setFreeRooms = setFreeRooms;
exports.deleteMergedDay = deleteMergedDay;