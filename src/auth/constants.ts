import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


export type RegisterUserPayload = {
    username: string;
    password: string;
    email: string;
    name: string;
}

export interface LoginUserPayload {
    username: string;
    password: string;
    id: string;
    email: string;
  }