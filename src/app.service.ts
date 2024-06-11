import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  render(): string {
    return 'Welcome to the Chat API';
  }
}
