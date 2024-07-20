import { Author } from "src/users/entities/author.entity";

declare module 'fastify' {
    export interface FastifyRequest {
        user: Author;
    }
}