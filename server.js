const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
const tasks = [];

//create task
app.post("/api/user/tasks", (req, res) => {
  const { taskName } = req.body;
  if (!taskName) return res.status(400).json({ message: "taskname required" });

  const taskExist = tasks.some((task) => task.name === taskName);

  if (!taskExist) {
    const newTask = { id: Date.now(), name: taskName };

    tasks.push(newTask);

    return res
      .status(201)
      .json({ message: "task created successfully", data: tasks });
  } else {
    return res
      .status(400)
      .json({ message: "duplicate task name, cant create!" });
  }
});

//get all tasks
app.get("/api/user/tasks", (req, res) => {
  return res.status(200).json(tasks);
});

//get task by id
app.get("/api/user/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskFound = tasks.find((task) => task.id === taskId);
  if (taskFound)
    return res.status(200).json({ message: "task found", data: taskFound });
  else return res.status(404).json({ message: "task not exist" });
});

//update tsask by id
app.put("/api/user/tasks/:id", (req, res) => {
  const { taskName } = req.body;
  const taskId = parseInt(req.params.id);
  const taskToUpdate = tasks.find((task) => task.id === taskId);
  if (taskToUpdate) {
    taskToUpdate.name = taskName ?? taskToUpdate.name;
    return res.status(200).json({ message: "task updated successfully" });
  } else {
    res.status(404).json({ message: "task not found" });
  }
});

//delete task by id
app.delete("/api/user/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
    return res.status(404).json({ message: "Task does not exist" });
  }
   
  const deletedTask = tasks.splice(taskIndex, 1)[0];

  return res.status(200).json({
    message: "Task deleted successfully",
    data: deletedTask,
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`server started on ${PORT}`));
