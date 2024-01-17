import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
