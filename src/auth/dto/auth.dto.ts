import { IsString, MinLength } from "class-validator"

export class AuthDto{
    @IsString()
    login:string

    @MinLength(6,{
        message:"Пароль должен быть по длине не меньше 6 символов"
    })
    @IsString()
    password: string
}