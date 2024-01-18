"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const task_1 = require("../controllers/task");
const auth_1 = require("../middleware/auth");
router.get("/", auth_1.verifyToken, task_1.getAlltasks);
router.post("/create", auth_1.verifyToken, task_1.createTask);
router.patch("/:taskId/update", auth_1.verifyToken, task_1.updateTask);
router.delete("/:taskId/delete", auth_1.verifyToken, task_1.deleteTask);
exports.default = router;
