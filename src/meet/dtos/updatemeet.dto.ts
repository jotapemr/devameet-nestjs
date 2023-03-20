import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";
import { MeetMessageHelper } from "../helpers/meetmessages.helper";
import { CreateMeetDto } from "./createmeet.dto";


export class UpdateMeetDto extends CreateMeetDto {

    @IsArray({message: MeetMessageHelper.UPDATE_OBEJCTNAME_NOT_FOUND})
    @Type(() => UpdateMeetObjectDto)
    @ValidateNested({each: true})
    objects: Array<UpdateMeetObjectDto>
}

export class UpdateMeetObjectDto {

    @IsNotEmpty({message: MeetMessageHelper.UPDATE_OBEJCTNAME_NOT_FOUND})
    name: string;

    @IsNumber({}, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Min(0, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Max(8, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    x: number;

    @IsNumber({}, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Min(0, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    @Max(8, {message: MeetMessageHelper.UPDATE_XY_VALIDATION})
    y: number;

    @IsNumber({}, {message: MeetMessageHelper.UPDATE_ZINDEX_VALIDATION})
    zIndex: number;

    @IsString({message: MeetMessageHelper.UPDATE_ORIENTATION_VALIDATION})
    orientation: string;

}