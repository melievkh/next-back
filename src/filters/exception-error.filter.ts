import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// @Catch()
// export class PostgresExceptionFilter implements ExceptionFilter {
//   catch(exception: MongoError, host: ArgumentsHost) {
//     switch (exception.code) {
//       case 11000:
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();
//         response.statusCode = HttpStatus.FORBIDDEN;
//         response.json({
//           message: exception.errmsg,
//           statusCode: HttpStatus.BAD_REQUEST,
//         });
//         break;
//       default:
//         console.log(exception);
//     }
//   }
// }
