import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { CurrentEmployee } from 'adymnar-backend/src/auth/decorators/employee.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto'
import { EmployeeService } from './employee.service'

@Controller('employee')
export class EmployeeController {
	constructor(private readonly employeeService: EmployeeService) {}

	@Get('/profile')
	@Auth()
	async getProfile(@CurrentEmployee('id') id: number) {
		return this.employeeService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/login')
	async loginEmployee(@Body() dto: AuthDto) {
		return this.employeeService.loginEmployee(dto)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/login/access-token')
	async getNewTokensEmployee(@Body() dto: RefreshTokenDto) {
		return this.employeeService.getNewTokensEmployee(dto.refreshToken)
	}
}
