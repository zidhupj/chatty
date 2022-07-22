import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CookieOptions, Response } from 'express'
import { hashOtp, verifyOtp } from "src/utils/hash";
import { GenerateOtpInputv1, LoginOtdv1, SignUpOtdv1 } from "../dto";
import { Prisma, PrismaClient, Role, user } from '@prisma/client'
import { generateAccessToken, generateRefreshToken } from "src/utils";
import { defaultAvatar } from 'src/assets/svg/defaults'
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
            throw new HttpException({
                error: "Invalid OTP",
                message: ["OTP", "OTP is inavalid!"],
                status: HttpStatus.BAD_REQUEST
            }, HttpStatus.BAD_REQUEST)
        }
    }

    setAccessAndRefreshToken = async (res: Response, user: user) => {
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: "localhost",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
        const accessToken = await generateAccessToken(user);
        res.cookie('accessToken', accessToken, cookieOptions);
        const refreshToken = await generateRefreshToken(user);
        res.cookie('refreshToken', refreshToken, cookieOptions);
    }

    signup = async (dto: SignUpOtdv1) => {
        try {
            const userData: Prisma.userCreateInput = {
                name: dto.name,
                username: dto.username,
                dateOfBirth: new Date(dto.dateOfBirth),
                avatar: dto.avatar ? dto.avatar : defaultAvatar,
                role: Role.user
            }
            dto.contact["phone"] ? userData["phone"] = dto.contact["phone"] : userData["email"] = dto.contact["email"];
            const newUser = await prisma.user.create({
                data: userData
            })
            console.log({ newUser })
            return newUser;

        } catch (err) {
            if (err?.meta?.target && err?.meta?.target?.length != 0) {
                throw new HttpException({
                    error: `Invalid Credentials`,
                    message: err.meta.target.map((value) => `${value} already exists.`),
                    status: HttpStatus.BAD_REQUEST
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new Error("Database user creation critical internal error!")
            }
        }
    }

    login = async (dto: LoginOtdv1) => {
        let user;
        try {
            user = await prisma.user.findUnique({
                where: Object.entries(dto.contact).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {})
            })
        } catch (err) {
            console.log(err)
            throw new Error("Database user retrieval critical internal error!")
        }

        if (!user) {
            throw new HttpException({
                error: `Invalid Credentials`,
                message: ["User does not exist!"],
                status: HttpStatus.NOT_FOUND
            }, HttpStatus.NOT_FOUND)
        }
        return user;
    }
}