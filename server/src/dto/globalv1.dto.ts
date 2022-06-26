
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEmpty, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPhoneNumber, Length, Max, MaxDate, Min, ValidateNested } from "class-validator";

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

export class UniqueUserInputv1 {
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested({ each: true })
    @Type((e) => e.object.contact.phone ? Phone : e.object.contact.email ? Email : Username)
    contact: Email | Phone | Username;
}