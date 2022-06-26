
import { Req } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "src/utils";

export async function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    console.log(accessToken);
    const userCred = await verifyToken(accessToken)
    console.log(userCred);
    if (!userCred) {
        return next();
    }
    req["userCred"] = { username: userCred.username, role: userCred.role };
    next();
}