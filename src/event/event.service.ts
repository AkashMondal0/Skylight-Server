import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  render(): string {
    return 'Welcome to the Chat API';
  }
}
