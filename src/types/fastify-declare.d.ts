import { User } from ".";

declare module 'fastify' {
    export interface FastifyRequest {
        user: User;
    }
}