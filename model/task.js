//model/task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",   
      required: false,  
    },
  },
  {
    timestamps: true, 
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;