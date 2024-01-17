import express from "express";
const router = express.Router();
import { createTask, getAlltasks } from "../controllers/task";
import { verifyToken } from "../middleware/auth";

router.get("/", verifyToken, getAlltasks);
router.post("/create", verifyToken, createTask);

export default router;
