import { Response } from 'express';

import asyncHandler from 'express-async-handler';
import Tasks from '../models/taskModel';
import { IRequest } from 'interfaces/user';

// @desc Get All Tasks
// @route GET /api/tasks
// @access private

const getAllTasks = asyncHandler(async (req: IRequest, res: Response) => {
    console.log(req.user.id);

    const tasks = await Tasks.find({ user_id: req.user.id });
    res.status(200).json(tasks);
});

// @desc Get Task By Id
// @route GET /api/tasks/:id
// @access private

const getAllTaskById = asyncHandler(async (req: IRequest, res: Response) => {
    const task = await Tasks.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Contact not Found');
    }
    res.status(200).json({ message: 'success', data: task });
});

// @desc Create New Tasks
// @route GET /api/tasks
// @access private

const createTasks = asyncHandler(async (req: IRequest, res: Response) => {
    console.log(`The IRequested Body is : `, req.body, req.user.id);

    const { title, dueDate, status } = req.body;

    if (!title || !dueDate || !status) {
        res.status(400);
        throw new Error('All fields are manditory');
    }

    if (!req.user) {
        res.status(401); // Unauthorized
        throw new Error('User is not authorized');
    }

    const task = await Tasks.create({
        title,
        dueDate,
        status,
        user_id: req.user.id
    });

    res.status(201).json({ message: 'Creatds Task', data: task });
});

// @desc Update Task By Id
// @route PUT /api/tasks/:id
// @access private

const updateTaskById = asyncHandler(async (req: IRequest, res: Response) => {
    const task = await Tasks.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not Found');
    }

    if (task.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Un Authorized');
    }

    const updateTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    res.status(200).json({ message: 'Updated Task', data: updateTask });
});

// @desc Delete Task By Id
// @route DELETE /api/tasks/:id
// @access private

const deleteTaskByID = asyncHandler(async (req: IRequest, res: Response) => {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not Found');
    }

    if (task.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Un Authorized');
    }

    await Tasks.findByIdAndRemove(req.params.id);

    res.status(200).json({ message: 'Task Deleted' });
});

export { getAllTasks, createTasks, updateTaskById, deleteTaskByID, getAllTaskById };
