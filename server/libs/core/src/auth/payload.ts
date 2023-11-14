import { Request } from "express";
import { JwtPayload } from 'jsonwebtoken';

export interface AuthPayload extends JwtPayload {
    address: string;
}

export interface AuthRequest extends Request {
    user: AuthPayload;
}