import { FastifyRequest, FastifyReply } from 'fastify';
import { Body, Controller, Delete, HttpCode, HttpException, HttpStatus, Patch, Post, Put, Req, Res, UseGuards, UsePipes, Version } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostPayload, CreatePostSchema, UpdatePostPayload, UpdatePostSchema } from 'src/validation/ZodSchema';
import { ZodValidationPipe } from 'src/validation/Validation';
@Controller({
    path: 'post',
    version: ['1']
})
export class PostController {
    constructor(private readonly postService: PostService) { }

    // @Post()
    // @Version('1')
    // @HttpCode(HttpStatus.CREATED)
    // @UsePipes(new ZodValidationPipe(CreatePostSchema))
    // @UseGuards(MyAuthGuard)
    // async CreatePost(@Body() body: CreatePostPayload) {
    //     return this.postService.create(body);
    // }

    // @Put()
    // @Version('1')
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(MyAuthGuard)
    // @UsePipes(new ZodValidationPipe(UpdatePostSchema))
    // async UpdatePost(@Req() req: FastifyRequest, @Body() body: UpdatePostPayload) {
    //     req.user
    //     return this.postService.create(body);
    // }

    // @Delete()
    // @Version('1')
    // @HttpCode(HttpStatus.OK)
    // @UsePipes(new ZodValidationPipe(UpdatePostSchema))
    // @UseGuards(MyAuthGuard)
    // async DeletePost(@Res() res: FastifyReply, @Body() body: { id: string }): Promise<void> {
    //     const data = await this.postService.remove(body.id);
    //     if (!data) {
    //         res.status(200).send({ message: 'Post deleted successfully' });
    //         return;
    //     }
    //     throw new HttpException('Internal Server Error', 500);
    // }
}
