import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import { MeetObject, MeetObjectDocument } from 'src/meet/schemas/meetobject.schema'; 
import { UserService } from 'src/user/user.service';
import { ToglMuteDto } from './dtos/toglMute.dto';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { RoomMessagesHelper } from './helpers/roommessages.helper';
import { Position, PositionDocument } from './schemas/position.schema';

@Injectable()
export class RoomService {

    private logger = new Logger(RoomService.name)

    constructor(
        @InjectModel(Meet.name) private readonly meetModel : Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel : Model<MeetObjectDocument>,
        @InjectModel(Position.name) private readonly positionModel : Model<PositionDocument>,
        private readonly userService: UserService
        
    ){}

    async getRoom(link: string){
        this.logger.debug(`getRoom - ${link}`)

        const meet = await this._getMeet(link) 
        const objects = await this.objectModel.find({meet})

        return{
            link, 
            name: meet.name, 
            color: meet.color, 
            objects 
        }
    }

    async listUsersPositionByLink(link:string){
        this.logger.debug(`listUsersPositionByLink - ${link}`)

        const meet = await this._getMeet(link) 
        return await this.positionModel.find({meet})
    }
    
    async deleteUsersPosition(clientId: string){
        this.logger.debug(`deleteUsersPositionByLink - ${clientId}`)
        return await this.positionModel.deleteMany({clientId})
    }

    async updateUserPosition(clientId:string ,dto : UpdateUserPositionDto){
            this.logger.debug(`listUsersPositionByLink - ${dto.link}`)

            const meet = await this._getMeet(dto.link)
            const user = await this.userService.getUserById(dto.userId)
            if(!user){
                throw new BadRequestException(RoomMessagesHelper.JOIN_USER_NOT_VALID)
            }

            const position = {
                ...dto,
                clientId,
                user,
                meet,
                name: user.name,
                avatar: user.avatar
            }

            const usersInRoom = await this.positionModel.find({meet})
            if(usersInRoom && usersInRoom.length > 10){
                throw new BadRequestException(RoomMessagesHelper.ROOM_MAX_USERS)
            }

            const loogedUserInRoom = usersInRoom.find(u => u.user.toString() === user._id.toString() || u.clientId === clientId)
            if(loogedUserInRoom){
                await this.positionModel.findByIdAndUpdate({_id: loogedUserInRoom._id},position)
            }else{
                await this.positionModel.create(position)
            }
    }

    async updateUserMute(dto: ToglMuteDto){
        this.logger.debug(`updateUserMute - ${dto.link} - ${dto.userId}`)

        const meet = await this._getMeet(dto.link)
        const user = await this.userService.getUserById(dto.userId)
        await this.positionModel.updateMany({user, meet}, {muted: dto.muted})

    }
    
    async userLastPosition(clientId: string, x:number, y:number){
        const position = await this.positionModel.findOne({clientId})
        if(position){
            position.lastX = x
            position.lastY = y
            await position.save()
        }
    }

    async getUserLastPositionClientId(clientId: string){
        const position = await this.positionModel.findOne({clientId})
        return position
    }

    
    async checkPosition(link: string, x: number, y: number) {
        const meet = await this._getMeet(link)
        const position = await this.positionModel.findOne({ meet, x, y })
        if(position){
            const checkUserNewX = Math.floor(Math.random() * 9)
            const checkUserNewY = Math.floor(Math.random() * 9)
            return {checkUserNewX, checkUserNewY}
        }
        return {checkUserNewX: 2, checkUserNewY: 2}
    }
    
   
    async _getMeet(link:string){
        const meet = await this.meetModel.findOne({link})
        if(!meet){
            throw new BadRequestException(RoomMessagesHelper.LINK_NOT_VALID)
        }

        return meet
    }
}
