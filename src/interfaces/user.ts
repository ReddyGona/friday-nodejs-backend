import { Request } from 'express';

export interface IUser {
    id: string;
    username: string;
    email: string;
}

export interface IRequest extends Request {
    user: IUser;
}
