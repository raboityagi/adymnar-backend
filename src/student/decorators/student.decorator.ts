import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Student } from '@prisma/client'

export const CurrentStudent = createParamDecorator(
	(data: keyof Student, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const student = request.user

		return data ? student?.[data] : student
	}
)
