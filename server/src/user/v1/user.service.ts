import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { HttpExceptionResponse } from "src/core/models/http.exception.response.interface";
import { AddContactDto } from "../dto";
const prisma = new PrismaClient()

@Injectable()
export class UserServicev1 {
    checkUser = async (dto: AddContactDto) => {
        try {
            const contactUser = await prisma.user.findFirst({
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
            if (!contactUser?.username) {
                throw new HttpException({
                    error: "Contact not Found",
                    message: ["The contact infered does not exist! Please try again with another contact."],
                    status: HttpStatus.NOT_FOUND
                }, HttpStatus.NOT_FOUND)
            }
            return contactUser;
        } catch (err) {
            console.log(err)
            throw new Error("Database user retrieval critical internal error!")
        }
    }

    addContact = async (contactUserName: string, username: string) => {
        try {
            // const user1 = await prisma.user.update({
            //     where: {
            //         username: username
            //     }, data: {
            //         myContacts: {
            //             connect: {
            //                 username: contactUserName
            //             }
            //         }
            //     }, select: {
            //         username: true,
            //         myContacts: {
            //             select: {
            //                 username: true
            //             }
            //         },
            //         relatedContacts: {
            //             select: {
            //                 username: true
            //             }
            //         },
            //     }
            // })
            const user = await prisma.chat.create({
                data: {
                    users: {
                        connect: [
                            { username: username },
                            { username: contactUserName }
                        ]
                    }
                }, select: {
                    users: {
                        where: {
                            username: username
                        }, select: {
                            username: true,
                            chats: {
                                select: {
                                    id: true,
                                    users: {
                                        select: {
                                            username: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return user;
        } catch (err) {
            console.log(err)
        }
    }

    getAllContacts = async (username: string) => {
        // return await prisma.user.findUnique({
        //     where: {
        //         username: username
        //     }, select: {
        //         myContacts: {
        //             select: {
        //                 username: true,
        //                 name: true,
        //                 avatar: true,
        //             }
        //         }
        //     }
        // })
        return await prisma.user.findUnique({
            where: {
                username: username
            }, select: {
                chats: {
                    select: {
                        id: true,
                        users: {
                            where: {
                                username: {
                                    not: username
                                }
                            },
                            select: {
                                name: true,
                                username: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        })
    }
}