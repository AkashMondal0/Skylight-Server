import { PipeTransform, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { z, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedBody = this.schema.parse(value);
      return parsedBody;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(error?.errors[0]?.message || "Validation failed");
      }
    }
  }
}
