import { Body, Controller, Post, UseGuards, UsePipes, Version } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostPayload, CreatePostSchema } from 'src/validation/ZodSchema';
import { SessionUser } from 'src/decorator/session.decorator';
import { User } from 'src/types';
import { ZodValidationPipe } from 'src/validation/Validation';
import { MyAuthGuard } from 'src/auth/guard/My-jwt-auth.guard';

@Controller({
    path: 'post',
    version: ['1']
})
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @Version('1')
    @UsePipes(new ZodValidationPipe(CreatePostSchema))
    // @UseGuards(MyAuthGuard)
    async CreatePost(@Body() body: CreatePostPayload, @SessionUser() user: User) {
        // console.log(body, user);
        return {
            body,
            // user
        }
        // return this.postService.create({ ...body, authorId: user.id });
    }
}
