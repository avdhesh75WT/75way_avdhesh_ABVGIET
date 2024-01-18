"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getAlltasks = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const utils_1 = require("../utils");
const User_1 = __importDefault(require("../models/User"));
const moment_1 = __importDefault(require("moment"));
const __1 = require("..");
const node_schedule_1 = __importDefault(require("node-schedule"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { title, time, interval, priority } = req.body;
        if (!title)
            return res.status(400).json("Please enter a title");
        if (interval && time && interval.length && time.length)
            return res
                .status(400)
                .json("You can not select both interval or time, selec either one of them");
        const task = yield Task_1.default.findOne({ title });
        if (task)
            return res
                .status(400)
                .json("Task already exists with same title, please try some other name for the title");
        const user = yield User_1.default.findById(id);
        if (!user)
            return res.status(400).json("User not found");
        let timeRes = null, intervalRes = null;
        if (interval && interval.length) {
            intervalRes = (0, utils_1.handleInterval)(interval, user.email, title);
            if (intervalRes === "wrong")
                return res
                    .status(400)
                    .json("Please select correct interval option, i.e from: 5s, 30s, 1m, 5m, 15m, 30m, 1h, 1d, 1mon");
        }
        else if (time && time.length) {
            timeRes = yield (0, utils_1.handleTime)(time, user.email, title, priority);
            if (timeRes === "future error")
                return res
                    .status(400)
                    .json("Enter a valid date which should not be in the past");
            else if (timeRes === "invalid date")
                return res
                    .status(400)
                    .json("Invalid date format, it should be (MM/DD/YYYY HH:MM:SS)");
        }
        else
            return res
                .status(400)
                .json("Please select either one of time or interval");
        // database tasks
        let timeObj = new Date(Date.parse(time));
        let newTimeString = time;
        if (time && time.length) {
            if (priority === "3" || priority === 3) {
                timeObj.setSeconds(timeObj.getSeconds() + 1);
                newTimeString = (0, moment_1.default)(timeObj).format("YYYY-MM-DD HH:mm:ss");
            }
            else if (priority === "1" || priority === 1) {
                timeObj.setSeconds(timeObj.getSeconds() - 1);
                newTimeString = (0, moment_1.default)(timeObj).format("YYYY-MM-DD HH:mm:ss");
            }
        }
        const newTask = yield Task_1.default.create({
            title,
            jobName: timeRes ? timeRes : intervalRes,
            time: newTimeString,
            interval,
            priority,
            owner: req.user.id,
        });
        yield newTask.save();
        const userTasks = user.tasks;
        userTasks.push(newTask._id);
        yield User_1.default.findByIdAndUpdate(id, { tasks: userTasks });
        return res.status(200).json("Task added successfully");
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.createTask = createTask;
const getAlltasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.find({});
        if (!tasks.length)
            return res.status(200).json("No tasks found");
        return res.status(200).json({ tasks });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getAlltasks = getAlltasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { taskId } = req.params;
        const { title, time, interval, priority } = req.body;
        if (!title)
            return res.status(400).json("Please enter a title");
        if (interval && time && interval.length && time.length)
            return res
                .status(400)
                .json("You can not select both interval or time, selec either one of them");
        const task = yield Task_1.default.findById(taskId);
        if (!task)
            return res.status(400).json("Task not found!");
        const isUniqueTitle = yield Task_1.default.findOne({ title });
        if (title !== task.title && isUniqueTitle)
            return res
                .status(400)
                .json("Another task with the provided title already exists, please try some other title.");
        const user = yield User_1.default.findById(id);
        if (!user)
            return res.status(400).json("User not found!");
        let timeRes = null, intervalRes = null;
        if (interval && interval.length) {
            intervalRes = (0, utils_1.handleInterval)(interval, user.email, title);
            if (intervalRes === "wrong")
                return res
                    .status(400)
                    .json("Please select correct interval option, i.e from: 5s, 30s, 1m, 5m, 15m, 30m, 1h, 1d, 1mon");
        }
        else if (time && time.length) {
            timeRes = (0, utils_1.handleTime)(time, user.email, title, priority);
            if (timeRes === "future error")
                return res
                    .status(400)
                    .json("Enter a valid date which should not be in the past");
            else if (timeRes === "invalid date")
                return res
                    .status(400)
                    .json("Invalid date format, it should be (MM/DD/YYYY HH:MM:SS)");
        }
        else
            return res
                .status(400)
                .json("Please select either one of time or interval");
        let updatedInterval = interval;
        let timeObj = new Date(Date.parse(time));
        let newTimeString = time;
        if (time && time.length) {
            if (priority === "3" || priority === 3) {
                timeObj.setSeconds(timeObj.getSeconds() + 1);
                newTimeString = (0, moment_1.default)(timeObj).format("YYYY-MM-DD HH:mm:ss");
            }
            else if (priority === "1" || priority === 1) {
                timeObj.setSeconds(timeObj.getSeconds() - 1);
                newTimeString = (0, moment_1.default)(timeObj).format("YYYY-MM-DD HH:mm:ss");
            }
            updatedInterval = null;
        }
        else
            newTimeString = null;
        //NOW DATABASE OPERATION START
        let updatedTask = {
            title,
            jobName: timeRes ? timeRes : intervalRes,
            time: newTimeString,
            interval: updatedInterval,
            priority,
            owner: task.owner,
        };
        for (let job of __1.JOBS) {
            if (job.name === task.jobName) {
                console.log(`JOB ${task.jobName} Updated to ${intervalRes ? intervalRes : timeRes}`);
                (0, __1.removeJob)(job);
            }
        }
        yield Task_1.default.findByIdAndUpdate(taskId, updatedTask);
        return res.status(200).json("Updated Successfully");
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { id } = req.user;
        const taskToDelete = yield Task_1.default.findById(taskId);
        if (!taskToDelete)
            return res.status(400).json("Task does not exist");
        const user = yield User_1.default.findById(id);
        if (!user)
            return res.status(400).json("User does not exist");
        yield Task_1.default.findByIdAndDelete(taskId);
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
        yield User_1.default.findByIdAndUpdate(id, updatedUser);
        for (let job of __1.JOBS) {
            if (job.name == taskToDelete.jobName) {
                node_schedule_1.default.cancelJob(job);
                console.log("JOB Canceled");
                (0, __1.removeJob)(job);
            }
        }
        return res.status(200).json("Task deleted successfully");
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteTask = deleteTask;
