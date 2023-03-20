import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request } from '@nestjs/common'; 
import { CreateMeetDto } from './dtos/createmeet.dto'; 
import { GetMeetDto } from './dtos/getmeet.dto'; 
import { UpdateMeetDto } from './dtos/updatemeet.dto';
import { MeetService } from './meet.service'; 

@Controller('meet') 
export class MeetController { 
constructor( 
private readonly service: MeetService) { } 

        @Get() 
        async getUser(@Request() req) { 
        const { userId } = req?.user; 
        const result = await this.service.getMeetByUser(userId); 

        return result?.map((m) => ({ 
                id: m._id.toString(), 
                name: m.name, 
                color: m.color, 
                link: m.link,
            }) as GetMeetDto); 
        } 

        @Post() 
        @HttpCode(HttpStatus.OK) 
        async create(@Request() req, @Body() dto: CreateMeetDto) { 
        const { userId } = req?.user; 
        await this.service.createMeet(userId, dto); 
    } 

        @Delete(':id') 
        @HttpCode(HttpStatus.NO_CONTENT) 
        async deleteMeet(@Param() params, @Request() req) { 
        const { userId } = req?.user; 
        const { id } = params; 
        await this.service.deleteMeetByUser(userId, id); 
    } 

    @Get('objects/:id') 
        async getObjectByMeetId(@Param() params, @Request() req) { 
        const { userId } = req?.user; 
        const { id } = params; 
        return await this.service.getMeetObject(id, userId); 
    } 

    @Put(':id') 
        async updateMeet(@Param() params, @Request() req, @Body() dto: UpdateMeetDto) { 
        const { userId } = req?.user; 
        const { id } = params; 
        return await this.service.update(id, userId, dto); 
    } 
}