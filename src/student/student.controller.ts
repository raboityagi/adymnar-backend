import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto'
import { CurrentStudent } from 'src/student/decorators/student.decorator'
import { StudentDto } from './student.dto'
import { StudentService } from './student.service'

@Controller('student')
export class StudentController {
	constructor(private readonly studentService: StudentService) {}

	@Get('/profile')
	@Auth()
	async getProfile(@CurrentStudent('id') id: number) {
		return this.studentService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('/profile')
	async updateProfile(
		@CurrentStudent('id') id: number,
		@Body() dto: StudentDto
	) {
		return this.studentService.updateProfile(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/login')
	async loginStudent(@Body() dto: AuthDto) {
		return this.studentService.loginStudent(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/login/access-token')
	async getNewTokensStudent(@Body() dto: RefreshTokenDto) {
		return this.studentService.getNewTokensStudent(dto.refreshToken)
	}
}
