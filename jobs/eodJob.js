// // jobs/eodJob.js
// import cron from "node-cron";
// import mongoose from "mongoose";
// import Task from "../model/task.js";
// import ArchivedTask from "../model/archivedTask.js";
// import DailySummary from "../model/dailySummary.js";

// cron.schedule("* * * * *", async () => {
//   console.log("EOD Process Started...");

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const totalCreated = await Task.countDocuments({
//       createdAt: { $gte: todayStart, $lte: todayEnd },
//     }).session(session);

//     const totalCompleted = await Task.countDocuments({
//       status: "Done",
//       updatedAt: { $gte: todayStart, $lte: todayEnd },
//     }).session(session);

//     const totalPending = await Task.countDocuments({
//       status: { $in: ["Todo", "In Progress"] },
//     }).session(session);

//     const completionPercentage =
//       totalCreated === 0
//         ? 0
//         : (totalCompleted / totalCreated) * 100;

//     await DailySummary.create(
//       [
//         {
//           date: todayStart,
//           totalCreated,
//           totalCompleted,
//           totalPending,
//           completionPercentage,
//           executionTimestamp: new Date(),
//         },
//       ],
//       { session }
//     );

//     console.log("Daily Summary Generated.");

//     await Task.updateMany(
//       { status: "In Progress" },
//       { $set: { status: "Not Completed" } },
//       { session }
//     );

//     const tasksToArchive = await Task.find({
//       createdAt: { $gte: todayStart, $lte: todayEnd },
//     }).session(session);

//     if (tasksToArchive.length > 0) {
//       const archiveData = tasksToArchive.map((task) => ({
//         originalTaskId: task._id,
//         title: task.title,
//         description: task.description,
//         status: task.status,
//         projectId: task.projectId,
//         createdAt: task.createdAt,
//         updatedAt: task.updatedAt,
//         archiveTimestamp: new Date(),
//       }));

//       await ArchivedTask.insertMany(archiveData, { session });

//       await Task.deleteMany(
//         { createdAt: { $gte: todayStart, $lte: todayEnd } },
//         { session }
//       );
//     }

//     await session.commitTransaction();
//     session.endSession();

//     console.log(" EOD Job Completed Successfully..");
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("EOD job Failed:", error);
//   }
// });

import cron from "node-cron";
import Task from "../model/task.js";
import ArchivedTask from "../model/archivedTask.js";
import DailySummary from "../model/dailySummary.js";

// Schedule EOD job every day at 23:59
cron.schedule("* * * * *", async () => {
  console.log("📊 EOD Process Started...");

  try {
    // Define today's start and end
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1️⃣ Count tasks
    const totalCreated = await Task.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const totalCompleted = await Task.countDocuments({
      status: "Done",
      updatedAt: { $gte: todayStart, $lte: todayEnd },
    });

    const totalPending = await Task.countDocuments({
      status: { $in: ["Todo", "In Progress"] },
    });

    const completionPercentage =
      totalCreated === 0
        ? 0
        : ((totalCompleted / totalCreated) * 100).toFixed(2);

    // 2️⃣ Save Daily Summary
    await DailySummary.create({
      date: todayStart,
      totalCreated,
      totalCompleted,
      totalPending,
      completionPercentage,
      executionTimestamp: new Date(),
    });

    console.log("✅ Daily Summary Generated.");

    // 3️⃣ Update In Progress tasks to Not Completed
    await Task.updateMany(
      { status: "In Progress" },
      { $set: { status: "Not Completed" } }
    );

    // 4️⃣ Archive today's tasks
    const tasksToArchive = await Task.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    if (tasksToArchive.length > 0) {
      const archiveData = tasksToArchive.map((task) => ({
        originalTaskId: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        projectId: task.projectId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        archiveTimestamp: new Date(),
      }));

      await ArchivedTask.insertMany(archiveData);
      await Task.deleteMany({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });
    }

    console.log("✅ EOD Job Completed Successfully.");
  } catch (error) {
    console.error("❌ EOD Job Failed:", error);
  }
});