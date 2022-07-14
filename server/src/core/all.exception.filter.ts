import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Request } from "express";
import { CustomHttpExceptionResponse, HttpExceptionResponse } from "./models/http.exception.response.interface";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost) {
        console.log("was here")
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>()
        const { httpAdapter } = this.httpAdapterHost

        let errorMessage: string
        let status: HttpStatus
        let message: string[]

        if (exception instanceof HttpException) {
            const errorResponse = exception.getResponse()
            console.log(errorResponse)
            errorMessage = (errorResponse as HttpExceptionResponse).error || exception.message
            status = exception.getStatus()
            message = (errorResponse as HttpExceptionResponse).message || []
        } else {
            // console.log(exception)
            status = HttpStatus.INTERNAL_SERVER_ERROR
            errorMessage = 'Critical Internal Server Error'
            message = [exception.message]
        }
        // console.log(exception)

        const errorResponse: CustomHttpExceptionResponse = {
            error: errorMessage,
            statusCode: status,
            message,
            method: request.method,
            path: request.url,
            timeStamp: new Date()
        }
        console.log(errorResponse)

        httpAdapter.reply(ctx.getResponse(), errorResponse, status);
    }
}