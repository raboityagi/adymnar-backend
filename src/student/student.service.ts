import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma, Student } from '@prisma/client'
import { hash, verify } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { updateStudentDto } from './student.dto'

@Injectable()
export class StudentService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}
	async byId(id: number, selectObject: Prisma.StudentSelect = {}) {
		const student = await this.prisma.student.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				login: true,
				name: true,
				surname: true,
				midname: true,
				...selectObject,
			},
		})

		if (!student) {
			throw new NotFoundException('User not found')
		}
		return student
	}

	async updateProfile(id: number, dto: updateStudentDto) {
		const student = await this.byId(id)
		return this.prisma.student.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				surname: dto.surname,
				midname: dto.midname,
				avatarPath: dto.avatarPath,
				password: dto.password ? await hash(dto.password) : student.password,
			},
		})
	}
	async loginStudent(dto: AuthDto) {
		const student = await this.validateStudent(dto)
		const tokens = await this.issueTokens(student.id)

		return {
			student: this.returnStudentFields(student),
			...tokens,
		}
	}

	private returnStudentFields(student: Student) {
		return {
			id: student.id,
			login: student.login,
		}
	}
	private async validateStudent(dto: AuthDto) {
		const student = await this.prisma.student.findUnique({
			where: {
				login: dto.login,
			},
		})
		if (!student) throw new NotFoundException('User not found')
		const isValid = await verify(student.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Invalid password')

		return student
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

	async getNewTokensStudent(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const student = await this.prisma.student.findUnique({
			where: {
				id: result.id,
			},
		})

		const tokens = await this.issueTokens(student.id)

		return {
			student: this.returnStudentFields(student),
			...tokens,
		}
	}
}
