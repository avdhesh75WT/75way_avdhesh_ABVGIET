import express from "express";
const router = express.Router();
import {
  createTask,
  getAlltasks,
  updateTask,
  deleteTask,
} from "../controllers/task";
import { verifyToken } from "../middleware/auth";

router.get("/", verifyToken, getAlltasks);
router.post("/create", verifyToken, createTask);
router.patch("/:taskId/update", verifyToken, updateTask);
router.delete("/:taskId/delete", verifyToken, deleteTask);

export default router;
