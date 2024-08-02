import { FastifyRequest, FastifyReply } from 'fastify';
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Req, Res, UseGuards, UsePipes, Version } from '@nestjs/common';
import { PostService } from './post.service';
// import { CreatePostPayload, CreatePostSchema, UpdatePostPayload, UpdatePostSchema } from 'src/lib/validation/ZodSchema';
// import { ZodValidationPipe } from 'src/lib/validation/Validation';
// import { MyAuthGuard } from 'src/auth/guard/My-jwt-auth.guard';
@Controller({
    path: 'post',
    version: ['1']
})
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: FastifyReply) {

        try {
            const Post = await this.postService.findPublicPostData(id);
            if (!Post) {
                throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
            }
            return res.send(Post)
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

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
