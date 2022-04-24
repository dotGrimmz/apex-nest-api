import {
  UseInterceptors,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  Next,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(ctx: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled

    return handler.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        return plainToClass(this.dto, data, {
          // flag to only display props on entity annotated with Expose
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
