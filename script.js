const taskInput = document.getElementById('taskInput');
const taskTime = document.getElementById('taskTime');
const taskList = document.getElementById('taskList');
window.onload = function() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task.text, task.time, task.completed));
};
function addTask() {
    const text = taskInput.value.trim();
    const time = taskTime.value;

    if(text === "") return;

    createTaskElement(text, time, false);
    saveTask(text, time, false);

    taskInput.value = "";
    taskTime.value = "";
}
function createTaskElement(text, time, completed) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${text} ${time ? `(${time})` : ''}</span>
                    <div>
                        <button onclick="toggleComplete(this)">✔️</button>
                        <button onclick="deleteTask(this)">🗑️</button>
                    </div>`;
    if(completed) li.classList.add('completed');
    taskList.appendChild(li);
}

function toggleComplete(button) {
    const li = button.closest('li');
    li.classList.toggle('completed');
    updateLocalStorage();
}

function deleteTask(button) {
    const li = button.closest('li');
    li.remove();
    updateLocalStorage();
}

function saveTask(text, time, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, time, completed, notified: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('li').forEach(li => {
        const span = li.querySelector('span').innerText;
        const regex = /(.*)\s\((.*)\)$/;
        const match = span.match(regex);
        const text = match ? match[1] : span;
        const time = match ? match[2] : '';
        tasks.push({
            text: text,
            time: time,
            completed: li.classList.contains('completed'),
            notified: false
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function checkNotifications() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date();
    const currentTime = now.toTimeString().slice(0,5);

    let updated = false;

    tasks.forEach(task => {
        if(task.time && task.time === currentTime && !task.notified && !task.completed) {
            alert(`⏰ Task Reminder: ${task.text} at ${task.time}`);
            task.notified = true;
            updated = true;
        }
    });

    if(updated) localStorage.setItem('tasks', JSON.stringify(tasks));
}
setInterval(checkNotifications, 60000);
checkNotifications(); 
