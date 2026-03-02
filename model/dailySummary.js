// model/dailySummary.js
import mongoose from "mongoose";

const dailySummarySchema = new mongoose.Schema({
  date: Date,
  totalCreated: Number,
  totalCompleted: Number,
  totalPending: Number,
  completionPercentage: Number,
  executionTimestamp: Date,
});

export default mongoose.model("DailySummary", dailySummarySchema);