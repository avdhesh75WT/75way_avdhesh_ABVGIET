import { Request, Response } from "express";
import Task from "../models/Task";
import { handleInterval, handleTime } from "../utils";
import User from "../models/User";
import moment from "moment";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { title, time, interval, priority } = req.body;
    if (!title) return res.status(400).json("Please enter a title");
    if (interval && time && interval.length && time.length)
      return res
        .status(400)
        .json(
          "You can not select both interval or time, selec either one of them"
        );
    const task = await Task.findOne({ title });
    if (task)
      return res
        .status(400)
        .json(
          "Task already exists with same title, please try some other name for the title"
        );
    const user = await User.findById(id);
    if (!user) return res.status(400).json("User not found");
    if (interval && interval.length) {
      const intervalRes = handleInterval(interval, user.email, title);
      if (intervalRes === "wrong")
        return res
          .status(400)
          .json(
            "Please select correct interval option, i.e from: 5s, 30s, 1m, 5m, 15m, 30m, 1h, 1d, 1mon"
          );
    } else if (time && time.length) {
      const timeRes = handleTime(time, user.email, title, priority);
      if (timeRes === "future error")
        return res
          .status(400)
          .json("Enter a valid date which should not be in the past");
      else if (timeRes === "invalid date")
        return res
          .status(400)
          .json("Invalid date format, it should be (MM/DD/YYYY HH:MM:SS)");
    } else
      return res
        .status(400)
        .json("Please select either one of time or interval");
    // database tasks
    let timeObj = new Date(Date.parse(time));
    let newTimeString = time;
    if (priority === "3" || priority === 3) {
      timeObj.setSeconds(timeObj.getSeconds() + 1);
      newTimeString = moment(timeObj).format("YYYY-MM-DD HH:mm:ss");
    } else if (priority === "1" || priority === 1) {
      timeObj.setSeconds(timeObj.getSeconds() - 1);
      newTimeString = moment(timeObj).format("YYYY-MM-DD HH:mm:ss");
    }
    const newTask = await Task.create({
      title,
      time: newTimeString,
      interval,
      priority,
      owner: req.user.id,
    });
    await newTask.save();
    const userTasks = user.tasks;
    userTasks.push(newTask._id);
    await User.findByIdAndUpdate(id, { tasks: userTasks });
    return res.status(200).json("Task added successfully");
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
export const getAlltasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({});
    if (!tasks.length) return res.status(200).json("No tasks found");
    return res.status(200).json({ tasks });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
