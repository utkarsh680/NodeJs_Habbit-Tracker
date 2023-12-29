var newHabitForm = document.getElementById("new-habit-form");
var button = document.querySelector(".save_");
var titleInput = document.querySelector(".user-title");
var descInput = document.querySelector(".user-desc");
var dateTimeInput = document.querySelector(".user-dateTime");

var cancelPage = document.querySelector(".habit-list-box");
var save = document.querySelector(".save");

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
        <i
        class="fa-solid fa-check"
        habit-id="${habit._id}"
        onclick="completeTask('${habit._id}')"
      ></i>
      <i
      class="fa-solid fa-xmark cut"
      onclick="deleteTask('${habit._id}')"
    ></i>
    <i class="fa-solid fa-minus"
    onclick="notCompleteTask('${habit._id}')"></i>
        </div>
      </div>

      <div class="time-desc">
        <h4 class="time">
          ${hours}:${minutes < 10 ? "0" + minutes : minutes} ${period}
        </h4>
        <h4 class="desc">${habit.desc}</h4>
      </div>
    </div>
  </div>
</li>`);
};

newHabitForm.addEventListener("submit", async function (e) {
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
      // console.log("Habit created successfully:", responseData);

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



async function deleteTask(taskId) {
  try {
    const response = await fetch(`/habit/delete/${taskId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log("Task deleted successfully:", responseData);
      // Assuming your task element has an id attribute
      const taskElement = $(`#habit-${taskId}`);
      console.log("Task element removed from the DOM.");
      if (taskElement) {
        taskElement.remove();
        console.log("Task element removed from the DOM.");
      }
      new Noty({
        theme: "relax",
        text: "habit deleted successfully!",
        type: "success",
        layout: "topCenter",
        timeout: 1000,
        className: "custom-notification-class", // Add your custom class here
      }).show();
    } else {
      console.log(`Server responded with status ${response.status}`);
      const errorResponse = await response.json();
      console.log("Error details:", errorResponse);
    }
  } catch (error) {
    console.error("An error occurred during the fetch operation:", error);
  }
}

async function completeTask(taskId) {
  try {
    console.log("tastID@@@@@@@@@", taskId);
    const response = await fetch(`/habit/complete/${taskId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complete: true,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Task completed successfully:", responseData);
      
      
      new Noty({
        theme: "relax",
        text: "habit done successfully!",
        type: "success",
        layout: "topCenter",
        timeout: 1000,
        className: "custom-notification-class", // Add your custom class here
      }).show();
      // Add your logic to update the UI or handle success as needed
      // For example, you can change the class of the completed task or remove it from the list
    } else {
      console.log(`Server responded with status ${response.status}`);
      const errorResponse = await response.json();
      console.log("Error details:", errorResponse);

      // Handle the error case, show a notification or perform other actions
    }
  } catch (error) {
    console.error("An error occurred during the fetch operation:", error);
  }
}

async function notCompleteTask(taskId) {
  try {
    
    const response = await fetch(`/habit/notCompleted/${taskId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complete: false,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Task unCompleted ", responseData);
      new Noty({
        theme: "relax",
        text: "task not Completed!",
        type: "success",
        layout: "topCenter",
        timeout: 1000,
        className: "custom-notification-class", // Add your custom class here
      }).show();
      // Add your logic to update the UI or handle success as needed
      // For example, you can change the class of the completed task or remove it from the list
    } else {
      console.log(`Server responded with status ${response.status}`);
      const errorResponse = await response.json();
      console.log("Error details:", errorResponse);

      // Handle the error case, show a notification or perform other actions
    }
  } catch (error) {
    console.error("An error occurred during the fetch operation:", error);
  }
}
