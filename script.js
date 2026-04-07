const taskInput = document.getElementById('taskInput');
const taskTime = document.getElementById('taskTime');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

/* Render Tasks */
function renderTasks() {
    taskList.innerHTML = "";

    const searchText = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const filterValue = document.getElementById("filter")?.value || "all";

    tasks.forEach((task, index) => {

        if (searchText && !task.text.toLowerCase().includes(searchText)) return;

        if (filterValue === "active" && task.completed) return;
        if (filterValue === "completed" && !task.completed) return;

        const li = document.createElement('li');
        li.classList.add(task.priority);
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <div class="task-info">
                <div class="task-title">
                    ${task.text}
                </div>
                <div class="task-meta">
                    ⏰ ${task.time || "No time"} | 
                    <span>${task.priority}</span>
                </div>
            </div>

            <div class="actions">
                <button onclick="toggleComplete(${index})">✔</button>
                <button onclick="editTask(${index})">✏</button>
                <button onclick="deleteTask(${index})">🗑</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

/* Add Task */
function addTask() {
    const text = taskInput.value.trim();
    const time = taskTime.value;
    const priority = priorityInput.value;

    if (!text) return;

    tasks.push({
        text,
        time,
        priority,
        completed: false,
        notified: false
    });

    saveTasks();

    taskInput.value = "";
    taskTime.value = "";

    renderTasks();
}

/* Toggle Complete */
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

/* Delete Task */
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

/* Edit Task */
function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
}

/* Save */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/* Stats */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;
}

/* Notifications */
function checkNotifications() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    tasks.forEach(task => {
        if (task.time === currentTime && !task.notified && !task.completed) {
            alert(`⏰ Reminder: ${task.text}`);
            task.notified = true;
        }
    });

    saveTasks();
}

setInterval(checkNotifications, 60000);

/* Initial render */
renderTasks();
