import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express'
import { AuthServicev1 } from './auth.service';
import { GenerateOtpInputv1, LoginOtdv1, SignUpOtdv1 } from '../dto';

@Controller({
    path: 'auth',
    version: ['1']
})
export class AuthControllerv1 {
    constructor(private authService: AuthServicev1) { }

    @Post('generate-otp')
    async generateOtp(@Body() dto: GenerateOtpInputv1) {
        const otp = this.authService.generateOtp();
        const hashedOtp = await this.authService.generateHashedOtp(otp, dto.contact);
        await this.authService.sendOtp(otp, dto);
        return { hashedOtp };
    }

    @Post('signup')
    async signup(@Body() dto: SignUpOtdv1, @Res({ passthrough: true }) res) {
        try {
            await this.authService.verifyOtp(dto.hashedOtp, dto.otp, dto.contact);
            const user = await this.authService.signup(dto);
            await this.authService.setAccessAndRefreshToken(res, user)
            return { user }
        }
        catch (err) {
            if (err.meta?.target?.includes("username")) {
                throw new HttpException("Username already exists", HttpStatus.BAD_REQUEST);
            }
            // Email already registered
            if (err.meta?.target?.includes("email")) {
                console.error("The email is already registered");
                throw new HttpException('The email is already registered!', HttpStatus.BAD_REQUEST);
            }
            // Phone already registered
            else if (err.meta?.target?.includes("phone")) {
                throw new HttpException('The phone number is already registered!', HttpStatus.BAD_REQUEST);
            }
            // Invalid OTP
            else if (err.message === "Invalid OTP") {
                throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
            }
            // Other errors
            throw new HttpException("Signup failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async login(@Body() dto: LoginOtdv1, @Res({ passthrough: true }) res: Response) {
        try {
            await this.authService.verifyOtp(dto.hashedOtp, dto.otp, dto.contact);
            const user = await this.authService.login(dto);
            await this.authService.setAccessAndRefreshToken(res, user)
            console.log(user)
            return user;
        } catch (err) {
            if (err["known"]) {
                throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException("Login failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}