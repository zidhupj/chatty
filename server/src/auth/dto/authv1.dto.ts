
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEmpty, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPhoneNumber, Length, Max, MaxDate, Min, ValidateNested } from "class-validator";
import { UniqueUserInputv1 } from "src/dto/globalv1.dto";

export class Phone {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;
}
export class Email {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class Username {
    @IsNotEmpty()
    @Length(3, 50)
    username: string;
}

export class GenerateOtpInputv1 extends UniqueUserInputv1 {
}

export class SignUpOtdv1 {
    @IsNotEmpty()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @Length(3, 50)
    username: string;

    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested({ each: true })
    @Type((e) => e.object.contact.phone ? Phone : Email)
    contact: Email | Phone;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @MaxDate(new Date())
    dateOfBirth: Date;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Max(999999)
    @Min(100000)
    otp: number;

    @IsNotEmpty()
    hashedOtp: string;

    avatar: string;
}

export class LoginOtdv1 extends UniqueUserInputv1 {

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Max(999999)
    @Min(100000)
    otp: number;

    @IsNotEmpty()
    hashedOtp: string;
}