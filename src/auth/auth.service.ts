import { faker } from '@faker-js/faker'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Student } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.student.findUnique({
			where: {
				login: dto.login,
			},
		})
		if (oldUser)
			throw new BadRequestException('User with this username already exists')

		const student = await this.prisma.student.create({
			data: {
				classId: 1,
				login: dto.login,
				name: faker.person.firstName(),
				surname: faker.person.lastName(),
				midname: '',
				avatarPath: faker.image.avatar(),
				password: await hash(dto.password),
			},
		})

		const tokens = await this.issueTokens(student.id)
		return {
			student: this.returnStudentFields(student),
			...tokens,
		}
	}

	private async issueTokens(studentId: number) {
		const data = { id: studentId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '45m',
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '2d',
		})
		return { accessToken, refreshToken }
	}

	private returnStudentFields(student: Student) {
		return {
			id: student.id,
			login: student.login,
		}
	}
}
