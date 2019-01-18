const axios = require('axios')  
const qs = require('qs')
const common = require('./time-service')
const current_date = new Date();
const current_time = parseInt('' + current_date.getHours() + ("0" + current_date.getMinutes()).slice(-2));
const easyroom = "https://easyroom.unitn.it/Orario/rooms_call.php";   

// Params object that contains the data used by the API
let params = {                      
  'form-type': 'rooms',
  sede: 'E0503', // POVO  
  date: '',      // Filled later with current date
  _lang: 'it'
};

/** 
 * http POST request (url, parameters)
 * */ 
function easyroomRequest() {   
  
  // set current date
  let date = new Date();
  params['date'] = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  
  return axios.post(easyroom, qs.stringify(params)); 
}
/**
 * This function should create the room object
 * The object should contain the rooms {room1: arr, room2: arr, .., roomN: arr}
 */
function createRoomsObject(data) {
    
  let rooms = {};
  // Check if the received object contains any lecture
  if (data.contains_events) {
    // Filter the data by selecting only the timetables for the classrooms
    let events = data.events;
    // For every object e in the event array
    events.forEach(e => {
      // Read the code of the classroom. This will be used to uniquely identify the room
      let roomCode = e.CodiceAula;
      // Create the lecture array with the from, to components
      let lessonHours = [e.from, e.to];

      // Add the lecture to the corresponding class in the rooms array
      // If the room doesn't exist in the object, create a new array with the roomCode as key
      if (!(roomCode in rooms)) {        
        rooms[roomCode] = new Array();
      }
      // Add the lecture to the array associated to the corresponding room
      rooms[roomCode].push(lessonHours);
    });
  } else {
    // If no events are in the arrat, log it and exit    
  }
  // Return the rooms object
  return rooms;
}



/**
 * This function takes in input the rooms object previously created and computes, for each classroom,
 *  
 */ 
function getFreeRooms(rooms) {
  
  // Define the array to be returned
  let freeRooms = [];
  // For each room determine its status and the next lecture
  for (let code in rooms) {        
    let room = rooms[code];
    let occupied = false;
    let occupied_until = null;
    let next_lesson = null;
    // Here we assume that the events are given in chronological order
    // Cycle until we haven't found the next lesson or we have read all events
    for (let i = 0; (next_lesson == null) && (i < room.length); i++) {
      // Get the current lecture of index i
      let time = room[i];
      // Convert the strings hh:mm:ss to the integers hhmm
      let from = common.parseTime(time[0]);
      let to = common.parseTime(time[1]);     
      // If the current time is past the start of the lecture but prior to its ending,
      // then the room is occupied
      if (current_time > from && current_time < to) {        
        occupied = true;
        // Set occupied_until to the end of the lecture
        occupied_until = to;
      }
      // Otherwise, if the current time is 
      else if (current_time < from) {
        // Next lesson for this room
        next_lesson = [from, to];
      }
    }
    // Create the object to be added to the returned array
    let output = {
      code: code,
      occupied: occupied,
      occupied_until: occupied_until,
      next_lesson: next_lesson
    }
    // Add the object to the array
    freeRooms.push(output);
  }  
  return freeRooms;
}

exports.easyroomRequest = easyroomRequest; 
exports.createRoomsObject = createRoomsObject;
exports.getFreeRooms = getFreeRooms;