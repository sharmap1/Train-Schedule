// web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD2sj_iPzt53XQtuG4nAFakDbfTlTjTqh4",
    authDomain: "train-schedule-1468b.firebaseapp.com",
    databaseURL: "https://train-schedule-1468b.firebaseio.com",
    projectId: "train-schedule-1468b",
    storageBucket: "",
    messagingSenderId: "850048373276",
    appId: "1:850048373276:web:8310980869267ea7b5c5d9"
  };
  // 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Create a variable to reference the database
var database =firebase.database();
// Initial Values
var trainName = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";
// var id =0;
function nowTime() {
  var now = moment().format('LT');
  $("#nowTime").html(now);
  setTimeout(nowTime, 1000);
};
// Capture Button Click
$("#add-button").on("click", function(event){
    event.preventDefault();
    // Code in the logic for storing and retrieving the most recent trains.
    var cTrain = $("#train-name").val().trim();
    var cTrainDestination = $("#train-destination").val().trim();
    var cTrainTime = $("#train-time").val().trim();
    var cTrainFreq = $("#train-freq").val().trim();
  
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-time").val("");
    $("#train-freq").val("");
    // Code for handling the push
    database.ref().push({
    name: cTrain,
    destination: cTrainDestination,
    time: cTrainTime,
    frequency: cTrainFreq,
    arrival: nextArrival,
    minutes: minutesAway,
    dateAdded: firebase.database.ServerValue.TIMESTAMP,
    // id: id++,
  });    
    //  alert that train was added
    alert("Train successuflly added!");

    var timeInput = " ";
    if (!timeInput.includes(":")) {
        alert("Military time requires a colon to separate hours and minutes!");
        return;
      }
      console.log(timeInput)
    // split string on colon
    var array = timeInput.split();
    var result = {
        hours: array[0],
        minutes: array[1],
    }

    // check if result is valid military time
    var isHoursOutOfBounds = result.hours > 23;     
    var isMinutesOutOfBounds = result.minutes > 59;  
     if (isHoursOutOfBounds || isMinutesOutOfBounds) {
        var bothOutOfBounds = isHoursOutOfBounds && isMinutesOutOfBounds;
        if (bothOutOfBounds)
            alert(`${result.hours} and ${result.minutes} are larger amounts than military time!`);
        else
              alert(`${isHoursOutOfBounds ? result.hours : result.minutes} is larger than military time!`);

        return;
    }
    //  empty form once submitted
    cTrain.val("");
    cTrainDestination.val("");
    cTrainTime.val("");
    cTrainFreq.val("");
  });
// Firebase watcher + initial loader 
database.ref().on("child_added", function(childSnapshot) {
    //  create local variables to store the data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = childSnapshot.val().frequency;
    // id = childSnapshot.val().id
    // compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
    trainDiff = moment().diff(moment.unix(childSnapshot.val().time), "minutes");
    // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;
    // subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;
    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");
    // full list of items to the well
    $("#table-data").append("<tr><td>" + childSnapshot.val().name + "</td>" +
    "<td>" + childSnapshot.val().destination + "</td>" +
    "<td>" + childSnapshot.val().frequency + "</td>" +
    "<td>" + minutesTillArrival + "</td>" +
    "<td>" + nextTrainTime + "  " + 
    "<a><span id='" + "' class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide(); 

    // Hover view of delete button
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });
      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
//   // function to call the button event, and store the values in the input form
// var storeInputs = function(event) {
//   // prevent from from reseting
//   event.preventDefault();
//   // get & store input values
//   trainName = cTrain.val().trim();
//   trainDestination = cTrainDestination.val().trim();
//   trainTime = moment(cTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
//   trainFrequency = cTrainFreq.val().trim();

// };

// // Calls storeInputs function if submit button clicked
// $("add-button").on("click", function(event) {
//   // form validation - if empty - alert
//   if (cTrain.val().length === 0 || cTrainDestination.val().length === 0 || cTrainTime.val().length === 0 || cTrainFreq === 0) {
//       alert("Please Fill All Required Fields");
//   } else {
//       // if form is filled out, run function
//       storeInputs(event);
//   }
// });

// Calls storeInputs function if enter key is clicked
// $('form').on("keypress", function(event) {
//   if (event.which === 13) {
//       // form validation - if empty - alert
//       if (cTrain.val().length === 0 || cTrainDestination.val().length === 0 || cTrainTime.val().length === 0 || cTrainFreq === 0) {
//           alert("Please Fill All Required Fields");
//       } else {
//           // if form is filled out, run function
//           storeInputs(event);
//       }
//   }
// });
  });
// $(".glyphicon glyphicon-remove icon-hidden").on("click",function(){
//   var dataId = parseInt($(this).attr("id"));

// });


  nowTime();
  
