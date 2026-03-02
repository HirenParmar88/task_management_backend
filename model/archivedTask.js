// model/archivedTask.js
import mongoose from "mongoose";

const archivedTaskSchema = new mongoose.Schema(
  {
    originalTaskId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    status: String,
    projectId: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    archiveTimestamp: Date,
  },
  { timestamps: true }
);

export default mongoose.model("ArchivedTask", archivedTaskSchema);