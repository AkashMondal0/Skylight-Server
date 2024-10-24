import { FastifyRequest, FastifyReply } from 'fastify';
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Req, Res, UseGuards, UsePipes, Version } from '@nestjs/common';
@Controller({
    path: 'post',
    version: ['1']
})
export class StoryController {
    // constructor(private readonly postService: PostService) { }
}
