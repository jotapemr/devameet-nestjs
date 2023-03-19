import { Matches, MinLength } from "class-validator";
import { MeetMessageHelper } from "../helpers/meetmessages.helper";

export class CreateMeetDto{

    @MinLength(2, {message: MeetMessageHelper.CREATE_NAME_NOT_VALID})
    name: string;

    @Matches(/[0-9A-Fa-f]{6}/, {message: MeetMessageHelper.CREATE_COLOR_NOT_VALID})
    color: string;
}