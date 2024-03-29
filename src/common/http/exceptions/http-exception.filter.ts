import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resposne = ctx.getResponse<Response>();
    const status = (exception = exception.getStatus());
    const errorResponse = exception.getResponse();

    const context = {
      statusCode: status,
      error: errorResponse['error'],
      message: errorResponse['message'],
      timestamp: formatTimestamp(Date.now()),
    };

    if (status === 401 || status === 403 || status === 404 || status === 500) {
      response.render('error', context);
    }
  }
}
