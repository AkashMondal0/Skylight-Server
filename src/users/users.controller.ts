import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Get, Query, Post, Body, Put, Param, Delete, HttpStatus, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller({
    path: 'users',
    version: '1',
})
export class UsersController {
    constructor(private usersService: UsersService) { }
    // @Post()
    // create(@Body() createCatDto: CreateCatDto) {
    //     return 'This action adds a new cat';
    // }

    // @Get()
    // findAll(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    //     res.status(HttpStatus.OK).send('This action returns all cats');
    // }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findUserById(id);
    }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    //     return `This action updates a #${id} cat`;
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return `This action removes a #${id} cat`;
    // }
}
