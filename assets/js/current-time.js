function updateCurrentTime() {
  var currentTimeElement = document.getElementById('currentTime');
  var currentTimeElement1 = document.getElementById('currentTime1');


  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();


  // Add leading zero if the value is less than 10
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  var formattedTime = hours + ":" + minutes;
  currentTimeElement.textContent = formattedTime;
  currentTimeElement1.textContent = formattedTime;
}

// Call the function to update the time immediately
updateCurrentTime();

// Update the time every second
setInterval(updateCurrentTime, 1000);
