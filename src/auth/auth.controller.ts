import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("register")
  async register(@Body() dto:AuthDto){
    return this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/student/login")
  async loginStudent(@Body() dto:AuthDto){
    return this.authService.loginStudent(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/employee/login")
  async loginEmployee(@Body() dto:AuthDto){
    return this.authService.loginStudent(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/student/login/access-token")
  async getNewTokensStudent(@Body() dto:RefreshTokenDto){
    return this.authService.getNewTokensStudent(dto.refreshToken);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/employee/login/access-token")
  async getNewTokensEmployee(@Body() dto:RefreshTokenDto){
    return this.authService.getNewTokensEmployee(dto.refreshToken);
  }
}
