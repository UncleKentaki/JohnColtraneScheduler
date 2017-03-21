$(document).ready(function () {
  console.log("test");
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAuXlcZQ6_c9k2o5KadcyLahlQ2ycQkXMc",
    authDomain: "johncoltranescheduler.firebaseapp.com",
    databaseURL: "https://johncoltranescheduler.firebaseio.com",
    storageBucket: "johncoltranescheduler.appspot.com",
    messagingSenderId: "856546843008"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  // 2. Button for adding Trains
  $("#submit-button").on("click", function (event) {
    event.preventDefault();
    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var trainStart = moment($("#start-time").val().trim(), "HH:mm").format("HH:mm");
    var trainFreq = $("#frequency").val().trim();
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      start: trainStart,
      frequency: trainFreq
    };
    // Uploads employee data to the database
    database.ref().push(newTrain);
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);
    // Alert
    alert("Train successfully added");
    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#start-time").val("");
    $("#frequency").val("");
    // Prevents moving to new page
    return false;
  });
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().frequency;
    // Employee Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStart);
    console.log(trainFreq);


    var tFrequency = trainFreq;
    // Time is 3:30 AM
    var firstTime = trainStart;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
    // Add each train's data into the table
    $("#table-body").append("<tr><td>" + trainName + "</td><td>" + trainDestination + 
    "</td><td>" + trainFreq + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
  });

});
