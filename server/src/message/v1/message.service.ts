import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Prisma, PrismaClient, Role, user } from '@prisma/client'
import { Socket } from "socket.io";
import { parseCookie, verifyToken } from "src/utils";

const prisma = new PrismaClient();

@Injectable()
export class MessageServicev1 {

    getUserCred = async (socket: Socket) => {
        const cookies = parseCookie(socket.handshake.headers.cookie)
        const userCred: { username: string, role: string } = await verifyToken(cookies.accessToken)
        console.log(userCred);
        if (!userCred?.username) {
            throw new Error("Invalid credentials")
        }
        return userCred;
    }

    storeSocketId = async (username: string, socket: Socket) => {
        await prisma.user.update({
            where: {
                username: username,
            }, data: {
                socketId: socket.id
            }
        })
    }

    deleteSocketId = async (username: string) => {
        await prisma.user.update({
            where: {
                username: username,
            }, data: {
                socketId: ""
            }
        })
    }

    createMessage = async (chatId: string, from: string, to: string, message: string) => {
        const result = await prisma.user.update({
            where: { username: from },
            data: {
                chats: {
                    update: {
                        where: { id: BigInt(chatId), },
                        data: {
                            messages: {
                                create: {
                                    from: { connect: { username: from } },
                                    to: { connect: { username: to } },
                                    message: message
                                }
                            }
                        }
                    },
                }
            }, select: {
                chats: {
                    where: { id: BigInt(chatId) },
                    select: {
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            select: {
                                fromId: true,
                                toId: true,
                                createdAt: true,
                                message: true,
                            },
                            take: 1
                        },
                        users: {
                            where: {
                                username: { not: from }
                            },
                            select: {
                                socketId: true
                            }
                        }
                    }
                }
            }
        })
        return { storedMessage: result.chats[0].messages[0], users: result.chats[0].users };
    }

    getMessageHistory = async (username: string, chatId: string, limit: number, offset: number) => {
        const result = await prisma.user.findUnique({
            where: { username: username },
            select: {
                chats: {
                    where: {
                        id: BigInt(chatId),
                    }, select: {
                        messages: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            take: limit,
                            skip: offset
                        }
                    }
                }
            }
        })
        return result.chats[0].messages.reverse();
    }
}