const addTaskButton = document.getElementById("add-task-btn");
const startTimerButton = document.getElementById("start-timer-btn");
const resetTimerButton = document.getElementById("reset-timer-btn");

function updateTime() {
  chrome.storage.local.get(["timer"], (res) => {
    const activeTime = document.getElementById("time");
    const minutes = 25 - Math.ceil(res.timer / 60);
    let seconds = "00";
    if (res.timer % 60 != 0) {
      seconds = 60 - (res.timer % 60);
    }
    activeTime.innerText = `${minutes}: ${seconds}`;
  });
}
updateTime();
setInterval(updateTime, 1000);

resetTimerButton.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
  });
});
startTimerButton.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    if (res.isRunning === true) {
      chrome.storage.local.set({
        isRunning: false,
      });
      startTimerButton.innerText = "Start Timer";
    } else if (res.isRunning === false) {
      chrome.storage.local.set({
        isRunning: true,
      });
      startTimerButton.innerText = "Stop Timer";
    }
  });
});

let tasks = [];

addTaskButton.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

function addTask() {
  const taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum);
  saveTasks();
}

function renderTask(taskNum) {
  const taskRow = document.createElement("div");
  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task";
  text.value = tasks[taskNum];
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.placeholder = "x";
  deleteBtn.value = "X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
}
function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
}
