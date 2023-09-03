import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  dueDate: string;
  status: string;
}

const taskSchema: Schema<ITask> = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: [true, "Please Add Task Title"] },
    dueDate: { type: String, required: [true, "Please Add Task Due Date"] },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<ITask>("Tasks", taskSchema);

export { TaskModel };
export default TaskModel;
