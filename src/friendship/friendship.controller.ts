import { FastifyRequest } from 'fastify';
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Patch, Post, Put, Req, Res, UseGuards, UsePipes, Version } from '@nestjs/common';
import { ZodValidationPipe } from 'src/lib/validation/Validation';
import { FriendshipService } from './friendship.service';

@Controller({
    path: 'friendship',
    version: '1',
})
export class FriendshipController {
    constructor(private readonly friendshipService: FriendshipService) { }
}
