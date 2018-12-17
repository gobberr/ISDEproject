// Import the required modules
const axios = require('axios')  // Similar to jQuery's ajax. Used to perform an http request
const qs = require('qs')        // QueryString module. We'll use the JSON stringify method
var current_date = new Date();
// Get the number of the day, month (0-11 so we need to do +1), and the year
var current_time = parseInt('' + current_date.getHours() + ("0" + current_date.getMinutes()).slice(-2));


// Declaration of the data to be used during the request
let easyroom = "https://easyroom.unitn.it/Orario/rooms_call.php";   // API of unitn to get the timetables
let params = {                      // Params object that contains the data used by the API
  'form-type': 'rooms',
  sede: 'E0503',                    // POVO
  //sede: '',
  date: '',                         // Filled later with current date
  _lang: 'it'
};

// Obtain current date and format it in the accepted format of the API
function setDate() {
    let date = new Date();
    
    // Get the number of the day, month (0-11 so we need to do +1), and the year
    let stringDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    
    // Insert the formatted date into the params object
    params['date'] = stringDate;  
    // console.log("Date: " + stringDate);
}

// Perform the http POST request (url, parameters)
function HTTPrequestJSON() {   
  setDate();
  //TODO: setTimeRange(); // passare il tempo recuperato dall'api del calendar
  return axios.post(easyroom, qs.stringify(params)); 
}

// This function should create the room object
// The object should contain the rooms {room1: arr, room2: arr, .., roomN: arr}
// Where each roomN component is an array of lectures {roomN: [lecture1, lecture2, .., lectureM]}
// Finally, each lecture is again an array, containing the starting and ending time (lectureM is [from, to])
// For the lecture just keep the from and to values contained in the received object for an event
function createRoomsObject(data) {
    // Define the object to be returned
    let rooms = {};
    // Check if the received object contains any lecture
    if (data.contains_events) {
        // Filter the data by selecting only the timetables for the classrooms
        var events = data.events;
        // For every object e in the event array
        events.forEach(e => {
            // Read the code of the classroom. This will be used to uniquely identify the room
            let roomCode = e.CodiceAula;
            // Create the lecture array with the from, to components
            let lessonHours = [e.from, e.to];

            // Add the lecture to the corresponding class in the rooms array
            // If the room doesn't exist in the object, create a new array with the roomCode as key
            if (!(roomCode in rooms)) {
                //console.log("Creating array for " + roomCode);
                rooms[roomCode] = new Array();
            }
            // Add the lecture to the array associated to the corresponding room
            rooms[roomCode].push(lessonHours);
        });
    }
    else {
        // If no events are in the arrat, log it and exit
        console.log("No events!");
    }
    // Return the rooms object
    return rooms;
}



// This function takes in input the rooms object previously created and computes, for each classroom,
// its status (free or occupied) and the next scheduled lecture. It also creates an array for which each
// component has four attributes {code, occupied, occupied_until, next_lesson} 
function getFreeRooms(rooms) {
  
  // Define the array to be returned
  var freeRooms = [];
  // For each room determine its status and the next lecture
  for (var code in rooms) {
      //console.log("Evaluating room " + code);
      // Init the variables
      var room = rooms[code];
      var occupied = false;
      var occupied_until = null;
      var next_lesson = null;
      // Here we assume that the events are given in chronological order
      // Cycle until we haven't found the next lesson or we have read all events
      for (var i = 0; (next_lesson == null) && (i < room.length); i++) {
          // Get the current lecture of index i
          var time = room[i];
          // Convert the strings hh:mm:ss to the integers hhmm
          var from = parseTime(time[0]);
          var to = parseTime(time[1]);
          //console.log(from, to)
          // If the current time is past the start of the lecture but prior to its ending,
          // then the room is occupied
          if (current_time > from && current_time < to) {
              //console.log("Room " + code + " currently occupied")
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
      var output = {
          code: code,
          occupied: occupied,
          occupied_until: occupied_until,
          next_lesson: next_lesson
      }
      // Add the object to the array
      freeRooms.push(output);
  }

  // Return the new computed array to fill the HTML page
  return freeRooms;
}

// The from, to values received from the server are strings formatted as hh:mm:ss
// This function converts the string in an integer that is more convenient during comparisons
function parseTime(time) {
    var tmp = time.split(":");
    // The resulting integer will be hhmm
    return parseInt(tmp[0] + tmp[1]);
}


// MODULE EXPORTS
exports.HTTPrequestJSON = HTTPrequestJSON;    // Make the function public
exports.createRoomsObject = createRoomsObject;
exports.getFreeRooms = getFreeRooms;