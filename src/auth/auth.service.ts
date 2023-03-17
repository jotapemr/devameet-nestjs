import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { RegisterDto } from "src/user/dtos/register.dto";
import { UserMessagesHelper } from "src/user/helpers/messages.helper";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dtos/login.dto";
import { MessagesHelper } from "./helpers/messages.helper";

@Injectable()
export class AuthService{
    private looger = new Logger(AuthService.name)

    constructor(private readonly userService: UserService){

    }

    login(dto: LoginDto){
        this.looger.debug('login - started')
        if(dto.login !== 'teste@teste.com' || dto.password !== 'teste123'){
           throw new BadRequestException(MessagesHelper.AUTH_PASSWORD_OR_LOGIN_NOT_FOUND);          
        }

        return dto;
    }

    async register(dto: RegisterDto){
        this.looger.debug('register - started')
        if(await this.userService.existByEmail(dto.email)){
            throw new BadRequestException(UserMessagesHelper.REGISTER_EXIST_EMAIL_ACCOUNT)
        }

        await this.userService.create(dto);
    }
}