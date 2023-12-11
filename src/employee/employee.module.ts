import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma.service'
import { EmployeeController } from './employee.controller'
import { EmployeeService } from './employee.service'
import { JwtStrategyEmployee } from './jwt.strategy'

@Module({
	controllers: [EmployeeController],
	providers: [EmployeeService, PrismaService, JwtStrategyEmployee],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
})
export class EmployeeModule {}
