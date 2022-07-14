import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { Role, Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { AddContactDto } from "../dto";
import { UserServicev1 } from "./user.service";
import 'src/patch/bigint'


@Controller({
    path: 'user',
    version: ['1']
})
export class UserControllerv1 {
    constructor(private userService: UserServicev1) { }

    @Post('/add-contact')
    @Roles(Role.User, Role.Admin)
    async addContact(@Body() dto: AddContactDto, @Req() req: Request) {
        const { username } = req["userCred"] as { username: string }
        const { username: contactUserName } = await this.userService.checkUser(dto)
        // add conntact to user
        return await this.userService.addContact(contactUserName, username)
    }

    @Get('/all-contacts')
    @Roles(Role.User, Role.Admin)
    async getAllContacts(@Req() req: Request) {
        const { username } = req["userCred"] as { username: string }
        return await this.userService.getAllContacts(username)
    }

}