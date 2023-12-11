import { IsOptional, IsString, MinLength } from 'class-validator'

export class StudentDto {
	@IsString()
	@IsOptional()
	login: string

	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	surname: string

	@IsOptional()
	@IsString()
	midname: string

	@IsOptional()
	@IsString()
	avatarPath: string

	@IsOptional()
	@MinLength(6, {
		message: 'Пароль должен быть по длине не меньше 6 символов',
	})
	@IsString()
	password: string
}

export type updateStudentDto = Omit<StudentDto, 'login'>
