import { Module } from '@nestjs/common'
import { AuthControllerv1 } from './v1/auth.controller';
import { AuthServicev1 } from './v1/auth.service';

@Module({
    controllers: [AuthControllerv1],
    providers: [AuthServicev1],
})
export class AuthModule { }