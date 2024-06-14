import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedBody = this.schema.parse(value);
      return parsedBody;
    } catch (error: any) {
      throw new BadRequestException(error?.errors[0]?.message || "Validation failed");
    }
  }
}
