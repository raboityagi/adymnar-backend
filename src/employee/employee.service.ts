import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SchoolEmployee } from '@prisma/client'
import { verify } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class EmployeeService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	async byId(id: number) {
		console.log(id)
		const employee = await this.prisma.schoolEmployee.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				login: true,
				name: true,
				surname: true,
				midname: true,
			},
		})

		if (!employee) {
			throw new NotFoundException('User not found')
		}
		return employee
	}

	private async issueTokens(employeeId: number) {
		const data = { id: employeeId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '45m',
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '2d',
		})
		return { accessToken, refreshToken }
	}

	async loginEmployee(dto: AuthDto) {
		const employee = await this.validateEmployee(dto)
		const tokens = await this.issueTokens(employee.id)

		return {
			employee: this.returnEmployeeFields(employee),
			...tokens,
		}
	}
	async getNewTokensEmployee(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const employee = await this.prisma.schoolEmployee.findUnique({
			where: {
				id: result.id,
			},
		})

		const tokens = await this.issueTokens(employee.id)

		return {
			employee: this.returnEmployeeFields(employee),
			...tokens,
		}
	}
	private returnEmployeeFields(employee: SchoolEmployee) {
		return {
			id: employee.id,
			login: employee.login,
		}
	}
	private async validateEmployee(dto: AuthDto) {
		const employee = await this.prisma.schoolEmployee.findUnique({
			where: {
				login: dto.login,
			},
		})
		if (!employee)
			throw new NotFoundException('User with this username already exists')
		const isValid = await verify(employee.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Invalid password')

		return employee
	}
}
