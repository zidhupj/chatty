import { user } from '@prisma/client';
import * as jwt from 'jsonwebtoken'

const generateToken = async (user: user, time: string) => {
    return await new Promise<string>((resolve, reject) => {
        jwt.sign({ username: user.username, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: time }, (err, token) => {
            resolve(token);
        })
    })
}

export const generateAccessToken = async (user: user) => generateToken(user, '7d');
export const generateRefreshToken = async (user: user) => generateToken(user, '7d');

export const verifyToken = async (token: string) => {
    try {
        return await new Promise<any>((resolve, reject) => {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, userCred) => {
                if (err) reject(err)
                resolve(userCred);
            })
        })
    } catch (err) {
        return undefined;
    }
}
