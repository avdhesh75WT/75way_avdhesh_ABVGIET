"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTime = exports.handleInterval = exports.validateEmail = exports.validatePassword = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const mails_1 = __importDefault(require("../services/mails"));
const __1 = require("..");
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
exports.validatePassword = validatePassword;
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const handleInterval = (interval, email, title) => {
    let job = null;
    if (interval === "5s") {
        job = node_schedule_1.default.scheduleJob("*/5 * * * * *", function () {
            console.log("After every 5 sec");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "30s") {
        job = node_schedule_1.default.scheduleJob("*/30 * * * * *", function () {
            console.log("After every 30 sec");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "1m") {
        job = node_schedule_1.default.scheduleJob("*/1 * * * *", function () {
            console.log("After every min");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "5m") {
        job = node_schedule_1.default.scheduleJob("*/5 * * * *", function () {
            console.log("After every 5 min");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "15m") {
        job = node_schedule_1.default.scheduleJob("*/15 * * * *", function () {
            console.log("After every 15 min");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "30m") {
        job = node_schedule_1.default.scheduleJob("*/30 * * * *", function () {
            console.log("After every 30 min");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "1h") {
        job = node_schedule_1.default.scheduleJob("* 1 * * *", function () {
            console.log("After every hour");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "1d") {
        job = node_schedule_1.default.scheduleJob("* 1 * *", function () {
            console.log("After every day");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "1w") {
        job = node_schedule_1.default.scheduleJob("* 1", function () {
            console.log("After every 1 week");
            (0, mails_1.default)(email, title);
        });
    }
    else if (interval === "1mon") {
        job = node_schedule_1.default.scheduleJob("* 1 *", function () {
            console.log("After every 1 month");
            (0, mails_1.default)(email, title);
        });
    }
    else
        return "wrong";
    __1.JOBS.push(job);
    console.log(job.name);
    return job.name;
};
exports.handleInterval = handleInterval;
const handleTime = (time, email, title, priority) => {
    let date = new Date(Date.parse(time));
    const currentDate = new Date();
    if (date < currentDate)
        return "future error";
    if (date.toString() == "Invalid Date")
        return "invalid date";
    if (priority === "3" || priority === 3) {
        date.setSeconds(date.getSeconds() + 1);
    }
    else if (priority === "1" || priority === 1) {
        date.setSeconds(date.getSeconds() - 1);
    }
    const job = node_schedule_1.default.scheduleJob(date, function () {
        console.log(`Expected to run at ${time} but ran at ${new Date().toString()}, with priority ${priority}`);
        (0, mails_1.default)(email, title);
    });
    __1.JOBS.push(job);
    console.log(job.name);
    return job.name;
};
exports.handleTime = handleTime;
