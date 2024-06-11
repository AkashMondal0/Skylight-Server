import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


export type RegisterUserPayload = {
    username: string;
    password: string;
    email: string;
    name: string;
}