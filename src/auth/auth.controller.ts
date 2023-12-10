import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserId } from "./decorators/user-id.decorator";
import { AuthDto } from "./dto/auth.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("register")
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/student/login")
  async loginStudent(@Body() dto: AuthDto) {
    return this.authService.loginStudent(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/employee/login")
  async loginEmployee(@Body() dto: AuthDto) {
    return this.authService.loginStudent(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/student/login/access-token")
  async getNewTokensStudent(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokensStudent(dto.refreshToken);
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() id: number) {
    return this.authService.findOne(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("/employee/login/access-token")
  async getNewTokensEmployee(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokensEmployee(dto.refreshToken);
  }
}
