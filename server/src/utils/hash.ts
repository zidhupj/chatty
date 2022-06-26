import * as argon2 from 'argon2';

export const hashOtp = async (otp: number, contact: any) => {
    const hashedOtp = await argon2.hash(JSON.stringify({ otp, contact, secret: process.env.OTP_SECRET }));
    return hashedOtp;
}
export const verifyOtp = async (hashedOtp: string, otp: number, contact: any) => {
    const isValid = await argon2.verify(hashedOtp, JSON.stringify({ otp: Number(otp), contact, secret: process.env.OTP_SECRET }));
    return isValid;
}