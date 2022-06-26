import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AddContactDto } from "../dto";
const prisma = new PrismaClient()

@Injectable()
export class UserServicev1 {
    checkUser = async (dto: AddContactDto) => {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: dto.contact["username"], },
                    { email: dto.contact["email"] },
                    { phone: dto.contact["phone"] }
                ]
            },
            select: {
                username: true,
            }
        })
        if (user?.username) {
            return "User exists"
        } else {
            return "User does not exist"
        }
    }
}