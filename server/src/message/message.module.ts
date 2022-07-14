import { Module } from '@nestjs/common';
import { MessageGatewayv1 } from './v1/message.gateway';
import { MessageServicev1 } from './v1/message.service';

@Module({
    providers: [MessageGatewayv1, MessageServicev1],
})
export class MessageModule { }