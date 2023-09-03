import { NextFunction, Response } from 'express';
import { IRequest, IUser } from '../interfaces/user';
import { sign, Secret, SignOptions, verify } from 'jsonwebtoken';

interface ISignAccessToken {
    user: IUser | string;
    secret: Secret;
    signInOptions: SignOptions;
}

interface IVerifyToken {
    token: string;
    secret: Secret;
    request: IRequest;
    response: Response;
    next?: NextFunction;
}

const signAccessToken = ({ user, secret, signInOptions }: ISignAccessToken): Promise<string> => {
    return new Promise((resolve, reject) => {
        const payload = { user };

        sign(payload, secret, signInOptions, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
                console.log('token : ', token);
            }
        });
    });
};

const verifyRefreshToken = ({ token, secret, request, response, next }: IVerifyToken): Promise<any> => {
    return new Promise((resolve, reject) => {
        verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                response.status(401);
                reject(new Error('User is not authorized'));
            } else {
                request.user = {
                    ...decoded.user
                };
                resolve(decoded.user); // Resolve with decoded user data
                next;
            }
        });
    });
};

export { signAccessToken, verifyRefreshToken };
