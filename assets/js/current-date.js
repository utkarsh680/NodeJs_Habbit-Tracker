function getCurrentDate() {
    var currentDateElement = document.getElementById('currentDate');
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
  
    const days = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'
    ];
  
    const currentDate = new Date();
    const dayOfWeek = days[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const dayOfMonth = currentDate.getDate();
  
    var formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;
    currentDateElement.textContent = formattedDate;
  }
  
  // Get and display the current date
  const formattedDate = getCurrentDate();
