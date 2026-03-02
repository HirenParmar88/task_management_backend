//controller/taskController.js
import Task from "../model/task.js";  

// Create Task
export const createTask = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    const newTask = new Task(req.body); 
    const savedTask = await newTask.save();
    return res.status(201).json({
      message: "Task created successfully",
      data: savedTask,
    });

  } catch (err) {
    console.error("Create Task Error:", err);
    return res.status(500).json({
      message: "Failed to create task",
      error: err.message,
    });
  }
};

// Get All Tasks (optional filter by projectId)
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    const tasks = await Task.find(filter).sort({ updatedAt: -1 });
    res.status(200).json({
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: err.message,
    });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    console.log("update task req.body: ", req.body);
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    console.log("updated data :", updateTask);
    res.status(200).json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update task",
      error: err.message,
    });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    console.log("delete tasks req.params.id :", req.params.id);
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete task",
      error: err.message,
    });
  }
};