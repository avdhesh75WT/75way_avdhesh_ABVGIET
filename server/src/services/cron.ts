import Task from "../models/Task";
import { handleInterval, handleTime } from "../utils";
import User from "../models/User";

export async function cronJob() {
  const tasks = await Task.find({});
  for (let task of tasks) {
    const user = await User.findById(task.owner);
    if (!user) console.log("User not found in cron");
    if (task.interval && task.interval.length) {
      handleInterval(task.interval, user!.email, task.title);
    } else if (task.time && task.time.length) {
      handleTime(task.time, user!.email, task.title, task.priority);
    }
  }
}
