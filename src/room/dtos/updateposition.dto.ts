import { IsNumber, IsString, Max, Min } from "class-validator"
import { MeetMessageHelper } from "src/meet/helpers/meetmessages.helper"
import { JoinRoomDto } from "./joinroom.dto"

export class UpdateUserPositionDto extends JoinRoomDto {

    @IsNumber({}, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Min(0, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Max(8, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    x: number

    @IsNumber({}, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Min(0, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Max(8, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    y: number

    @IsString({message: MeetMessageHelper.UPDATE_ORIENTATION_VALIDATION})
    orientation: string
}