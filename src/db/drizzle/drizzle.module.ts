import { Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.provider';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configs/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
    envFilePath: ['.env'],
  })],
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule { }