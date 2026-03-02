//router/taskRouter.js
import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../validation/taskValidation.js";

const router = express.Router();

// Task router
router.post("/", validateCreateTask, createTask);
router.get("/", getTasks);
router.put("/:id", validateUpdateTask, updateTask);
router.delete("/:id", deleteTask);

export default router;
