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
exports.cronJob = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const utils_1 = require("../utils");
const User_1 = __importDefault(require("../models/User"));
function cronJob() {
    return __awaiter(this, void 0, void 0, function* () {
        const tasks = yield Task_1.default.find({});
        for (let task of tasks) {
            const user = yield User_1.default.findById(task.owner);
            if (!user)
                console.log("User not found in cron");
            if (task.interval && task.interval.length) {
                let intervalRes = (0, utils_1.handleInterval)(task.interval, user.email, task.title);
                if (intervalRes !== "wrong") {
                    const updatedTask = {
                        title: task.title,
                        jobName: intervalRes,
                        time: task.time,
                        interval: task.interval,
                        priority: task.priority,
                    };
                    yield Task_1.default.findByIdAndUpdate(task._id, updatedTask);
                }
            }
            else if (task.time && task.time.length) {
                let timeRes = (0, utils_1.handleTime)(task.time, user.email, task.title, task.priority);
                if (timeRes !== "future error" && timeRes !== "invalid date") {
                    const updatedTask = {
                        title: task.title,
                        jobName: timeRes,
                        time: task.time,
                        interval: task.interval,
                        priority: task.priority,
                    };
                    yield Task_1.default.findByIdAndUpdate(task._id, updatedTask);
                }
            }
        }
    });
}
exports.cronJob = cronJob;
