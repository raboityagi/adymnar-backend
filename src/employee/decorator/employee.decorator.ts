import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { SchoolEmployee } from '@prisma/client'

export const CurrentEmployee = createParamDecorator(
	(data: keyof SchoolEmployee, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const employee = request.user

		return data ? employee?.[data] : employee
	}
)
