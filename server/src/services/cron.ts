import Task from "../models/Task";
import { handleInterval, handleTime } from "../utils";
import User from "../models/User";

export async function cronJob() {
  const tasks = await Task.find({});
  for (let task of tasks) {
    const user = await User.findById(task.owner);
    if (!user) console.log("User not found in cron");
    if (task.interval && task.interval.length) {
      let intervalRes = handleInterval(task.interval, user!.email, task.title);
      if (intervalRes !== "wrong") {
        const updatedTask = {
          title: task.title,
          jobName: intervalRes,
          time: task.time,
          interval: task.interval,
          priority: task.priority,
        };
        await Task.findByIdAndUpdate(task._id, updatedTask);
      }
    } else if (task.time && task.time.length) {
      let timeRes = handleTime(
        task.time,
        user!.email,
        task.title,
        task.priority
      );
      if (timeRes !== "future error" && timeRes !== "invalid date") {
        const updatedTask = {
          title: task.title,
          jobName: timeRes,
          time: task.time,
          interval: task.interval,
          priority: task.priority,
        };
        await Task.findByIdAndUpdate(task._id, updatedTask);
      }
    }
  }
}
