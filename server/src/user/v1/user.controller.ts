import { Body, Controller, Post } from "@nestjs/common";
import { Role, Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { AddContactDto } from "../dto";
import { UserServicev1 } from "./user.service";


@Controller({
    path: 'user',
    version: ['1']
})
export class UserControllerv1 {
    constructor(private userService: UserServicev1) { }

    @Post('/add-contact')
    @Roles(Role.User)
    async addContact(@Body() dto: AddContactDto) {
        return await this.userService.checkUser(dto)
    }
}