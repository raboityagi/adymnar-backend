import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma.service'
import { StudentController } from './student.controller'
import { StudentService } from './student.service'
import { StudentJwtStrategy } from './studentJwt.strategy'

@Module({
	controllers: [StudentController],
	providers: [StudentService, PrismaService, StudentJwtStrategy],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
})
export class StudentModule {}
