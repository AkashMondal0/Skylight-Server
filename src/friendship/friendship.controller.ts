import { Body, Controller, Delete, HttpCode, HttpException, HttpStatus, Patch, Post, Put, Req, Res, UseGuards, UsePipes, Version } from '@nestjs/common';
import { ZodValidationPipe } from 'src/validation/Validation';
import { MyAuthGuard } from 'src/auth/guard/My-jwt-auth.guard';
import { FriendshipService } from './friendship.service';

@Controller({
    path: 'friendship',
    version: '1',
})
export class FriendshipController {
    constructor(private readonly followService: FriendshipService) { }
}
