const express = require('express');
const sql = require('./db');

const app = express();

app.use(express.json()); // convert req body into json

app.use(express.static('public'));

const getTasks = async () => {
    const tasks = await sql`select * from tasks`
    return tasks;
}

app.get('/tasks', async (req, res, next) => {
    const tasks = await getTasks();
    res.status(200).json({
        tasks: tasks
    });
});

app.post('/task', async (req, res, next) => {
    try {
        if (!req.body.newTask) {
            res.status(400).json({
                message: 'Please give task in newTask'
            });
            return;
        }

        // INSERT INTO tasks("gym")
        await sql`INSERT INTO tasks (name) VALUES (${req.body.newTask})`;

        res.status(200).json({
            message: 'Task added successfully'
        });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            message: 'Something went wrong',
            error: error
        });
    }
});

app.delete('/task/:taskId', async (req, res, next) => {
    try {
        await sql`DELETE FROM tasks where id = ${req.params.taskId}`
        res.status(200).json({
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
            error: error
        });
    }
});

app.put('/task/:taskId', async (req, res, next) => {
    try {
        await sql`UPDATE tasks SET name=${req.body.newTask} WHERE id=${req.params.taskId}`;
        res.status(200).json({
            message: 'Task updated successfully'
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
            error: error
        });
    }
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});

// const taskElem = document.getElementById("task");
// const input = document.getElementById("input");
// const baseUrl = "https://todo-0fnk.onrender.com";

// // Fetch all tasks
// const getTasks = async () => {
//   try {
//     const response = await fetch(`${baseUrl}/tasks`, {
//       method: "GET",
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to fetch tasks");
//     }
    
//     const body = await response.json();
    
//     taskElem.innerHTML = '';
//     body.tasks.forEach((task) => {
//       createTaskElement(task);
//     });
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     showNotification("Failed to load tasks");
//   }
// };

// // Create task element with edit and delete buttons
// const createTaskElement = (task) => {
//   const taskItem = document.createElement("li");
//   taskItem.className = "flex items-center justify-between bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition duration-200";
//   taskItem.dataset.id = task.id;
  
//   const normalView = document.createElement("div");
//   normalView.className = "flex items-center justify-between w-full";
  
//   const taskText = document.createElement("span");
//   taskText.className = "text-gray-800 break-words flex-1";
//   taskText.innerText = task.name;
  
//   const actionsDiv = document.createElement("div");
//   actionsDiv.className = "flex space-x-2";
  
//   const editBtn = document.createElement("button");
//   editBtn.className = "bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition duration-200";
//   editBtn.innerText = "Edit";
//   editBtn.onclick = () => {
//     toggleEditMode(taskItem, task);
//   };
  
//   const deleteBtn = document.createElement("button");
//   deleteBtn.className = "bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition duration-200";
//   deleteBtn.innerText = "Delete";
//   deleteBtn.onclick = () => deleteTask(task.id);
  
//   actionsDiv.appendChild(editBtn);
//   actionsDiv.appendChild(deleteBtn);
  
//   normalView.appendChild(taskText);
//   normalView.appendChild(actionsDiv);
  
//   taskItem.appendChild(normalView);
//   taskElem.appendChild(taskItem);
// };

// // Toggle edit mode for a task
// const toggleEditMode = (taskItem, task) => {
//   const normalView = taskItem.querySelector("div");
  
//   // Create edit mode view
//   const editView = document.createElement("div");
//   editView.className = "flex items-center justify-between w-full";
  
//   const editInput = document.createElement("input");
//   editInput.type = "text";
//   editInput.value = task.name;
//   editInput.className = "flex-1 p-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500";
  
//   const actionBtns = document.createElement("div");
//   actionBtns.className = "flex space-x-2";
  
//   const saveBtn = document.createElement("button");
//   saveBtn.className = "bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition duration-200";
//   saveBtn.innerText = "Save";
//   saveBtn.onclick = () => updateTask(task.id, editInput.value, taskItem);
  
//   const cancelBtn = document.createElement("button");
//   cancelBtn.className = "bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition duration-200";
//   cancelBtn.innerText = "Cancel";
//   cancelBtn.onclick = () => {
//     taskItem.removeChild(editView);
//     taskItem.appendChild(normalView);
//   };
  
//   actionBtns.appendChild(saveBtn);
//   actionBtns.appendChild(cancelBtn);
  
//   editView.appendChild(editInput);
//   editView.appendChild(actionBtns);
  
//   // Replace normal view with edit view
//   taskItem.removeChild(normalView);
//   taskItem.appendChild(editView);
//   editInput.focus();
// };

// // Add a new task
// const add = async () => {
//   const taskValue = input.value.trim();
  
//   if (!taskValue) {
//     showNotification("Please enter a task");
//     return;
//   }
  
//   try {
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         newTask: taskValue,
//       }),
//     };

//     const response = await fetch(
//       `${baseUrl}/task`,
//       requestOptions
//     );
    
//     if (!response.ok) {
//       throw new Error("Failed to add task");
//     }

//     input.value = "";
//     getTasks();
//     showNotification("Task added successfully");
//   } catch (error) {
//     console.error("Error adding task:", error);
//     showNotification("Failed to add task");
//   }
// };

// // Delete a task
// const deleteTask = async (taskId) => {
//   if (!confirm("Are you sure you want to delete this task?")) {
//     return;
//   }
  
//   try {
//     const response = await fetch(`${baseUrl}/task/${taskId}`, {
//       method: "DELETE",
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to delete task");
//     }
    
//     getTasks();
//     showNotification("Task deleted successfully");
//   } catch (error) {
//     console.error("Error deleting task:", error);
//     showNotification("Failed to delete task");
//   }
// };

// // Update a task
// const updateTask = async (taskId, newTaskName, taskItem) => {
//   if (!newTaskName.trim()) {
//     showNotification("Task cannot be empty");
//     return;
//   }
  
//   try {
//     const response = await fetch(`${baseUrl}/task/${taskId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         newTask: newTaskName,
//       }),
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to update task");
//     }
    
//     getTasks();
//     showNotification("Task updated successfully");
//   } catch (error) {
//     console.error("Error updating task:", error);
//     showNotification("Failed to update task");
//   }
// };

// // Show notification
// const showNotification = (message) => {
//   // Check if notification container exists
//   let notificationContainer = document.getElementById("notification-container");
  
//   if (!notificationContainer) {
//     notificationContainer = document.createElement("div");
//     notificationContainer.id = "notification-container";
//     notificationContainer.className = "fixed bottom-4 right-4 max-w-xs";
//     document.body.appendChild(notificationContainer);
//   }
  
//   const notification = document.createElement("div");
//   notification.className = "bg-gray-800 text-white px-4 py-3 rounded shadow-lg mb-2 transform transition-transform duration-300 translate-y-0";
//   notification.innerText = message;
  
//   notificationContainer.appendChild(notification);
  
//   // Remove notification after 3 seconds
//   setTimeout(() => {
//     notification.classList.add("translate-y-full", "opacity-0");
//     setTimeout(() => {
//       notificationContainer.removeChild(notification);
//     }, 300);
//   }, 3000);
// };

// // Initialize the app
// getTasks();

// // Add event listener for Enter key on input
// input.addEventListener("keypress", (event) => {
//   if (event.key === "Enter") {
//     add();
//   }
// });