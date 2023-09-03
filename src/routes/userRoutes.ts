import express, { Router, NextFunction, Response } from 'express';
import { currentUser, loginUser, refreshToken, registerUser } from '../controllers/userController';
import { validationToken } from '../middleware/validateToken';
import { IRequest } from 'interfaces/user';
import asyncHandler from 'express-async-handler';

const userRouter: Router = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/login', loginUser);

userRouter.post('/current', validationToken, currentUser);

userRouter.post('/refresh', refreshToken);

export { userRouter };
