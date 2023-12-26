var newHabitForm = document.getElementById("new-habit-form");
var button = document.querySelector(".save_");
var titleInput = document.querySelector(".user-title");
var descInput = document.querySelector(".user-desc");
var dateTimeInput = document.querySelector(".user-dateTime");

var cancelPage = document.querySelector(".habit-list-box")
var save = document.querySelector('.save');

const newHabitElement = (habit) => {
  const habitDate = new Date(habit.dateTime);
  const hours = habitDate.getHours() % 12 || 12;
  const minutes = habitDate.getMinutes();
  const period = habitDate.getHours() >= 12 ? "PM" : "AM";
  return $(`<li>
  <div class="habit-view">
    <div class="habit-view-item">
      <div class="left-side">
        <h3>${habit.title}</h3>
        <div class="control-button">
          <i class="fa-solid fa-check"></i>
          <i class="fa-solid fa-xmark cut"></i>
          <i class="fa-solid fa-minus"></i>
        </div>
      </div>

      <div class="time-desc">
        <h4 class="time">
          ${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${period}
        </h4>
        <h4 class="desc">${habit.desc}</h4>
      </div>
    </div>
  </div>
</li>`);
};

  newHabitForm.addEventListener("submit", async function(e)  {
    e.preventDefault();
  
    var title = titleInput.value;
    var desc = descInput.value;
    var dateTime = dateTimeInput.value;
  
    try {
      const response = await fetch("/habit/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          desc: desc,
          dateTime: dateTime,
        }),
      });
      console.log(response);
      if (response.ok) {
        const responseData = await response.json();
        console.log("Habit created successfully:", responseData);
  
        // Reset input values
        titleInput.value = "";
        descInput.value = "";
        dateTimeInput.value = "";
  
        // Handle success message according to your application's framework
        // For example, in Express.js with connect-flash:
        new Noty({
          theme: "relax",
          text: "habit created successfully!",
          type: "success",
          layout: "topCenter",
          timeout: 1000,
          className: "custom-notification-class", // Add your custom class here
        }).show();
        const ul = $("#habit-list");
        // const li = document.createElement(newHabitElement(responseData.habit));
  
        ul.prepend(newHabitElement(responseData.habit));
      } else {
        console.log(`Server responded with status ${response.status}`);
        const errorResponse = await response.json();
        console.log("Error details:", errorResponse);
      }
    } catch (error) {
      console.error("An error occurred during the fetch operation:", error);
    }
  });


// If you want to add cancel functionality
document.querySelector(".cancel_").addEventListener("click", function () {
  // Add your cancel logic here
  console.log("Cancelled");
  newHabitForm.reset();
});
document.querySelector(".cancel").addEventListener("click", function () {
  // Add your cancel logic here
  console.log("Cancelled");
   // Reload the page
   location.reload();
});

