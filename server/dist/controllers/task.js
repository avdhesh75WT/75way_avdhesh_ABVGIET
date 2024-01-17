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
exports.getAlltasks = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const utils_1 = require("../utils");
const User_1 = __importDefault(require("../models/User"));
const moment_1 = __importDefault(require("moment"));
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
        if (interval && interval.length) {
            const intervalRes = (0, utils_1.handleInterval)(interval, user.email, title);
            if (intervalRes === "wrong")
                return res
                    .status(400)
                    .json("Please select correct interval option, i.e from: 5s, 30s, 1m, 5m, 15m, 30m, 1h, 1d, 1mon");
        }
        else if (time && time.length) {
            const timeRes = (0, utils_1.handleTime)(time, user.email, title, priority);
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
        if (priority === "3" || priority === 3) {
            timeObj.setSeconds(timeObj.getSeconds() + 1);
            newTimeString = (0, moment_1.default)(timeObj).format("YYYY-MM-DD HH:mm:ss");
        }
        else if (priority === "1" || priority === 1) {
            timeObj.setSeconds(timeObj.getSeconds() - 1);
            newTimeString = (0, moment_1.default)(timeObj).format("YYYY-MM-DD HH:mm:ss");
        }
        const newTask = yield Task_1.default.create({
            title,
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
