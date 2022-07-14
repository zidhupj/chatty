import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionFilter } from 'src/core/all.exception.filter';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserControllerv1 } from './v1/user.controller';
import { UserServicev1 } from './v1/user.service';

@Module({
    controllers: [UserControllerv1],
    providers: [UserServicev1, {
        provide: APP_GUARD,
        useClass: RolesGuard
    }, {
            provide: APP_FILTER,
            useClass: AllExceptionFilter
        }]
})
export class UserModule { }
