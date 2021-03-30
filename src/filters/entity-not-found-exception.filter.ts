import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'

@Catch(EntityNotFoundError, Error)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(404).json({
      error: 'Not Found',
      message: exception.message,
      statusCode: 404,
    })
  }
}
