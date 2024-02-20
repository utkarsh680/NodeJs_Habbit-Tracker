var newHabitForm = document.getElementById("new-habit-form");
var button = document.querySelector(".save_");
var cancelPage = document.querySelector(".habit-list-box");
var save = document.querySelector(".save");
var titleInput = document.querySelector(".user-title");
var descInput = document.querySelector(".user-desc");
var dateTimeInput = document.querySelector(".user-dateTime");

const newHabitElement = (habit) => {
  const habitDate = new Date(habit.dateTime);
  const hours = habitDate.getHours() % 12 || 12;
  const minutes = habitDate.getMinutes();
  const period = habitDate.getHours() >= 12 ? "PM" : "AM";
  return $(`<li id = "habit-${habit._id}" > 
  <div class="habit-view">
  <div class="habit-view-item">
      <div class="left-side">
          <h3>${habit.title}</h3>
          <div class="control-button">
              <div class="skill">
                  <div class="outer">
                      <div class="inner">
                          <i class="fa-solid fa-check ${
                            habit.complete === true
                              ? "green-color"
                              : "white-color" }" 
                              habit-id="${habit._id}" 
                              id="checked_${habit._id}" onclick="completeTask('${habit._id}')"></i>
                      </div>
                  </div>
              </div>
              <div class="skill">
                  <div class="outer">
                      <div class="inner">
                          <i class="fa-solid fa-xmark cut" id="cross" onclick="deleteTask('${
                            habit._id
                          }')"></i>
                      </div>
                  </div>
              </div>
              <div class="skill">
                  <div class="outer">
                      <div class="inner">
                          <i class="fa-solid fa-minus ${
                            habit.complete === false
                              ? "red-color"
                              : "white-color"
                          }" 
                             id="unChecked_${habit._id}" onclick="notCompleteTask('${
                               habit._id
                             }')"></i>
                      </div>
                  </div>
              </div>
              <div onclick="handleUpdateHabit('${habit._id}')">
                      <i class="fa-solid fa-pen-to-square" id="edit-button"></i>
                </div>
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

const habitIdInput = document.getElementById("habit-id");

// If you want to add cancel functionality
document.querySelector(".cancel_").addEventListener("click", function () {
  // Add your cancel logic here
  console.log("Cancelled");
  newHabitForm.reset();
});

var form = document.getElementById("form-box");
var habitList = document.querySelector(".habit-list");
var icon = document.querySelector(".ipad-button");
var hover = document.querySelector(".icon h3");
var formDisplay = document.getElementById("form-box_");

function toggleFormAndBlur() {
  if (form.style.display === "none") {
    form.style.display = "block";
    form.classList.remove("animate__zoomOut");
    form.classList.add("animate__zoomIn");
    habitList.classList.add("blur");
    icon.classList.remove("fa-plus");
    icon.classList.add("fa-minus");
  } else {
    setTimeout(() => {
      form.style.display = "none";
    }, 500);

    form.classList.add("animate__zoomOut");
    form.classList.remove("animate__zoomIn");
    habitList.classList.remove("blur");
    icon.classList.remove("fa-minus");
    icon.classList.add("fa-plus");

    formDisplay.style.display = "none";
  }
}

//edit button

let editButton = document.querySelector("#edit-button");

editButton?.addEventListener("click", function () {
  toggleFormAndBlur();
  if (form.style.display === "none") {
    form.style.display = "block";
    form.classList.remove("animate__zoomOut");
    form.classList.add("animate__zoomIn");
    habitList.classList.add("blur");
    icon.classList.remove("fa-plus");
    icon.classList.add("fa-minus");
  }
});

document.querySelector(".cancel")?.addEventListener("click", function () {
  // Add your cancel logic here
  newHabitForm.reset();
  toggleFormAndBlur();
});

// form submit
newHabitForm?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const habitId = habitIdInput.value;
  const formType = document.getElementById("form-type");
  

  var title = titleInput.value;
  var desc = descInput.value;
  var dateTime = dateTimeInput.value;
  const url =
    formType.value === "newHabitForm"
      ? "/habit/create"
      : `/habit/update/${habitId}`;

  try {
    const response = await fetch(url, {
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
  
    if (response.ok) {
      const responseData = await response.json();

      // Reset input values
      titleInput.value = "";
      descInput.value = "";
      dateTimeInput.value = "";

      // Handle success message according to your application's framework
      // For example, in Express.js with connect-flash:
      new Noty({
        theme: "relax",
        text: `habit ${
          formType.value === "newHabitForm" ? "created" : "updated"
        } successfully!`,
        type: "success",
        layout: "topCenter",
        timeout: 1000,
        className: "custom-notification-class", // Add your custom class here
      }).show();
      if (formType.value === "newHabitForm") {
        const ul = $("#habit-list");
        ul.prepend(newHabitElement(responseData.habit));
      } else {
        const habitElement = $(`#habit-${habitId}`);
        habitElement.replaceWith(newHabitElement(responseData.habit));
      }
      // const li = document.createElement(newHabitElement(responseData.habit));
    } else {
      // console.log(`Server responded with status ${response.status}`);
      const errorResponse = await response.json();
      console.log("Error details:", errorResponse);
    }
  } catch (error) {
    console.error("An error occurred during the fetch operation:", error);
  }
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
      // console.log("Task deleted successfully:", responseData);
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
     

      const checked = $(`#checked_${taskId}`);
      const unChecked = $(`#unChecked_${taskId}`);
      // Make sure the elements are not null before manipulating them
      checked.css({
        color: "green",
      });

      unChecked.css({
        color: "white",
        transition: "all 0.4s ease",
      });

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
   
      const checked = $(`#checked_${taskId}`);
      const unChecked = $(`#unChecked_${taskId}`);
      // Make sure the elements are not null before manipulating them
      // Make sure the elements are not null before manipulating them
      checked.css({
        color: "white",
      });

      unChecked.css({
        color: "red",
        transition: "all 0.4s ease",
      });
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
function handleHomeButtonClick() {
  // update the formType value to update
  const formType = document.getElementById("form-type");
  formType.value = "newHabitForm";
  openForm();
}

function openForm() {
  var formDisplay = document.getElementById("form-box_");

  if (formDisplay.style.display === "none") {
    formDisplay.style.display = "block";
    formDisplay.classList.remove("animate__fadeOutRight");
  } else {
    formDisplay.classList.add("animate__fadeOutRight");
    setTimeout(() => {
      formDisplay.style.display = "none";
    }, 500);
  }
}

// function to handle the update habit button click
const handleUpdateHabit = (habitId) => {
  
  // update the formType value to update
  const formType = document.getElementById("form-type");
  formType.value = "editHabitForm";

  const habit = document.getElementById(`habit-${habitId}`);
  const habitTitle = habit.querySelector(".habit-view-item h3").innerText;
  const habitDesc = habit.querySelector(".habit-view-item .desc").innerText;
  const habitDateTime = habit.querySelector(".habit-view-item .time").innerText;

  titleInput.value = habitTitle;
  descInput.value = habitDesc;
  dateTimeInput.value = habitDateTime;
  habitIdInput.value = habitId;
  openForm();
};
