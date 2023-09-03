import express, { Router } from "express";
import {
  createTasks,
  deleteTaskByID,
  getAllTaskById,
  getAllTasks,
  updateTaskById,
} from "../controllers/taskController";
import { validationToken } from "../middleware/validateToken";

const taskRouter: Router = express.Router();

taskRouter.use(validationToken);

taskRouter.route("/").get(getAllTasks);

taskRouter.route("/:id").get(getAllTaskById);

taskRouter.route("/").post(createTasks);

taskRouter.route("/:id").put(updateTaskById);

taskRouter.route("/:id").delete(deleteTaskByID);

export { taskRouter };
