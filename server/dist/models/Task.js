"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TaskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    jobName: {
        type: String,
        unique: true,
        required: true,
    },
    time: {
        type: String,
        default: null,
    },
    interval: {
        type: String,
        enum: ["5s", "30s", "1m", "5m", "15m", "30m", "1h", "1d", "1w", "1mon"],
        default: null,
    },
    priority: {
        type: Number,
        default: 2,
        enum: [1, 2, 3],
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
const Task = mongoose_1.default.model("Task", TaskSchema);
exports.default = Task;
