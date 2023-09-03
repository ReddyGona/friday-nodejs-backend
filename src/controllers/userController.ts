import { Response } from 'express';

import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { IRequest, IUser } from '../interfaces/user';
import { loginSchema, registerSchema } from '../config/validationSchema';
import { signAccessToken, verifyRefreshToken } from '../config/jwtToken';
// import { client } from '../config/init_redis';
const bcrypt = require('bcrypt');

// @desc Register User
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler(async (req: IRequest, res: Response) => {
    const { username, email, password } = req.body;
    await registerSchema.validateAsync(req.body);

    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error('User Already Registered');
    }

    // hashing the password

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password : `, hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error('User data is not valid');
    }
});

// @desc User Login
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async (req: IRequest, res: Response) => {
    const { email, password } = req.body;

    await loginSchema.validateAsync(req.body);

    if (!email || !password) {
        res.status(400);
        throw new Error('All Fields are manditory');
    }

    const user = await User.findOne({ email });

    // compare password with hased pswd

    if (user && (await bcrypt.compare(password, user.password))) {
        const userData: IUser = {
            username: user.username,
            id: user.id,
            email: user.email
        };
        // Generate an access token with a short expiration time (e.g., 15 minutes)
        const accessToken = await signAccessToken({
            user: userData,
            secret: process.env.ACCESS_TOKEN_SECRET,
            signInOptions: { expiresIn: '15m' }
        });

        // Generate a refresh token with a longer expiration time (e.g., days or weeks)
        const refreshToken = await signAccessToken({
            user: userData,
            secret: process.env.REFRESH_TOKEN_SECRET,
            signInOptions: { expiresIn: '7d' }
        });

        // await client.SET(user.id, refreshToken, { EX: 7 * 24 * 60 * 60 });

        res.status(200).json({
            accessToken,
            refreshToken,
            user: { email: user.email, id: user.id }
        });
    } else {
        res.status(401);
        throw new Error('Invalid Login Credentials');
    }
});

// @desc Current User
// @route POST /api/users/current
// @access public

const currentUser = asyncHandler(async (req: IRequest, res: Response) => {
    res.json(req.user.id);
});

const refreshToken = asyncHandler(async (req: IRequest, res: Response) => {
    const { token } = req.body;
    if (!token) {
        res.status(401);
        throw new Error('Required Refresh Token');
    }

    await verifyRefreshToken({
        token: token,
        secret: process.env.REFRESH_TOKEN_SECRET,
        request: req,
        response: res
    });

    const user = req.user;

    const userData: IUser = {
        username: user.username,
        id: user.id,
        email: user.email
    };
    // Generate an access token with a short expiration time (e.g., 15 minutes)
    const accessToken = await signAccessToken({
        user: userData,
        secret: process.env.ACCESS_TOKEN_SECRET,
        signInOptions: { expiresIn: '15m' }
    });

    // Generate a refresh token with a longer expiration time (e.g., days or weeks)
    const refreshToken = await signAccessToken({
        user: userData,
        secret: process.env.REFRESH_TOKEN_SECRET,
        signInOptions: { expiresIn: '7d' }
    });

    // await client.GET(user.id, (error: Error, result: string) => {
    //     if (error) {
    //         res.status(500);
    //         throw new Error('Internal Server Error');
    //     }
    //     if (refreshToken === result) return;
    //     res.status(401);
    //     throw new Error('Un Authorized');
    // });

    // await client.SET(user.id, refreshToken, { EX: 7 * 24 * 60 * 60 });

    res.status(200).json({
        refreshToken: refreshToken,
        accessToken: accessToken
    });
});

export { registerUser, loginUser, currentUser, refreshToken };
