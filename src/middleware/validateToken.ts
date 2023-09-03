import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { IRequest } from 'interfaces/user';
const jwt = require('jsonwebtoken');

const validationToken = asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string, // Cast to string or provide the appropriate type
            (err: any, decoded: any) => {
                if (err) {
                    res.status(401);
                    throw new Error('User is not authorized');
                }
                req.user = {
                    ...decoded.user // Add user properties from decoded token
                }; // Assuming decoded contains user information
                console.log('decoded :', decoded);

                next();
            }
        );
    } else {
        res.status(401);
        throw new Error('User is not authorized or token is missing');
    }
});

export { validationToken };
