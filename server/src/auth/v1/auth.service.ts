import { Injectable } from "@nestjs/common";
import { CookieOptions, Response } from 'express'
import { hashOtp, verifyOtp } from "src/utils/hash";
import { GenerateOtpInputv1, LoginOtdv1, SignUpOtdv1 } from "../dto";
import { Prisma, PrismaClient, Role, user } from '@prisma/client'
import { generateAccessToken, generateRefreshToken } from "src/utils";
const prisma = new PrismaClient()

@Injectable()
export class AuthServicev1 {

    generateOtp() {
        return Math.floor(Math.random() * (999999 - 100000)) + 100000 as number;
    }
    generateHashedOtp = async (otp: number, contact: any) => {
        // console.log({ contact })
        return await hashOtp(otp, contact);
    }
    sendOtp = async (otp: number, dto: GenerateOtpInputv1) => {
        if (dto.contact["email"]) {
            console.log("Email sent", otp);
        } else if (dto.contact["phone"]) {
            console.log("SMS sent", otp);
        } else if (dto.contact["username"]) {
            console.log("Username sent", otp);
        }
    }

    verifyOtp = async (hashedOtp: string, otp: number, contact: any) => {
        const valid = await verifyOtp(hashedOtp, otp, contact);
        if (!valid) {
            const e = new Error("Invalid OTP");
            e["known"] = true;
            throw e;
        }
    }

    setAccessAndRefreshToken = async (res: Response, user: user) => {
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: "localhost"
        }
        const accessToken = await generateAccessToken(user);
        res.cookie('accessToken', accessToken, cookieOptions);
        const refreshToken = await generateRefreshToken(user);
        res.cookie('refreshToken', refreshToken, cookieOptions);
    }

    signup = async (dto: SignUpOtdv1) => {
        const userData: Prisma.userCreateInput = {
            name: dto.name,
            username: dto.username,
            dateOfBirth: dto.dateOfBirth,
            avatar: dto.avatar ? dto.avatar : null,
            role: Role.user
        }
        dto.contact["phone"] ? userData["phone"] = dto.contact["phone"] : userData["email"] = dto.contact["email"];
        const newUser = await prisma.user.create({
            data: userData
        })
        console.log({ newUser })
        return newUser;
    }

    login = async (dto: LoginOtdv1) => {
        const user = await prisma.user.findUnique({
            where: Object.entries(dto.contact).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {})
        })
        // console.log(user)
        if (!user) {
            const e = new Error("User does not exist!");
            e["known"] = true;
            throw e;
        }
        return user;
    }
}