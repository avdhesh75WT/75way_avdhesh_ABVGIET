import { Request, Response } from "express";
import Task from "../models/Task";
import { handleInterval, handleTime } from "../utils";
import User from "../models/User";
import moment from "moment";
import { JOBS, removeJob } from "..";
import schedule from "node-schedule";

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
    let timeRes = null,
      intervalRes = null;
    if (interval && interval.length) {
      intervalRes = handleInterval(interval, user.email, title);
      if (intervalRes === "wrong")
        return res
          .status(400)
          .json(
            "Please select correct interval option, i.e from: 5s, 30s, 1m, 5m, 15m, 30m, 1h, 1d, 1mon"
          );
    } else if (time && time.length) {
      timeRes = await handleTime(time, user.email, title, priority);
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
    if (time && time.length) {
      if (priority === "3" || priority === 3) {
        timeObj.setSeconds(timeObj.getSeconds() + 1);
        newTimeString = moment(timeObj).format("YYYY-MM-DD HH:mm:ss");
      } else if (priority === "1" || priority === 1) {
        timeObj.setSeconds(timeObj.getSeconds() - 1);
        newTimeString = moment(timeObj).format("YYYY-MM-DD HH:mm:ss");
      }
    }
    const newTask = await Task.create({
      title,
      jobName: timeRes ? timeRes : intervalRes,
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

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { taskId } = req.params;
    const { title, time, interval, priority } = req.body;
    if (!title) return res.status(400).json("Please enter a title");
    if (interval && time && interval.length && time.length)
      return res
        .status(400)
        .json(
          "You can not select both interval or time, selec either one of them"
        );
    const task = await Task.findById(taskId);
    if (!task) return res.status(400).json("Task not found!");
    const isUniqueTitle = await Task.findOne({ title });
    if (title !== task.title && isUniqueTitle)
      return res
        .status(400)
        .json(
          "Another task with the provided title already exists, please try some other title."
        );
    const user = await User.findById(id);
    if (!user) return res.status(400).json("User not found!");
    let timeRes = null,
      intervalRes = null;
    if (interval && interval.length) {
      intervalRes = handleInterval(interval, user.email, title);
      if (intervalRes === "wrong")
        return res
          .status(400)
          .json(
            "Please select correct interval option, i.e from: 5s, 30s, 1m, 5m, 15m, 30m, 1h, 1d, 1mon"
          );
    } else if (time && time.length) {
      timeRes = handleTime(time, user.email, title, priority);
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
    let updatedInterval = interval;
    let timeObj = new Date(Date.parse(time));
    let newTimeString = time;
    if (time && time.length) {
      if (priority === "3" || priority === 3) {
        timeObj.setSeconds(timeObj.getSeconds() + 1);
        newTimeString = moment(timeObj).format("YYYY-MM-DD HH:mm:ss");
      } else if (priority === "1" || priority === 1) {
        timeObj.setSeconds(timeObj.getSeconds() - 1);
        newTimeString = moment(timeObj).format("YYYY-MM-DD HH:mm:ss");
      }
      updatedInterval = null;
    } else newTimeString = null;
    //NOW DATABASE OPERATION START
    let updatedTask = {
      title,
      jobName: timeRes ? timeRes : intervalRes,
      time: newTimeString,
      interval: updatedInterval,
      priority,
      owner: task.owner,
    };
    for (let job of JOBS) {
      if (job.name === task.jobName) {
        console.log(
          `JOB ${task.jobName} Updated to ${
            intervalRes ? intervalRes : timeRes
          }`
        );
        removeJob(job);
      }
    }
    await Task.findByIdAndUpdate(taskId, updatedTask);
    return res.status(200).json("Updated Successfully");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { id } = req.user;
    const taskToDelete = await Task.findById(taskId);
    if (!taskToDelete) return res.status(400).json("Task does not exist");
    const user = await User.findById(id);
    if (!user) return res.status(400).json("User does not exist");
    await Task.findByIdAndDelete(taskId);
    let userTasks = user.tasks;
    const updatedTasks = userTasks.filter((task) => {
      return task.toString() !== taskToDelete._id.toString();
    });
    const updatedUser = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      tasks: updatedTasks,
    };
    await User.findByIdAndUpdate(id, updatedUser);
    for (let job of JOBS) {
      if (job.name == taskToDelete.jobName) {
        schedule.cancelJob(job);
        console.log("JOB Canceled");
        removeJob(job);
      }
    }
    return res.status(200).json("Task deleted successfully");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
