import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EmployeeModule } from './employee/employee.module'
import { EventModule } from './event/event.module'
import { PrismaService } from './prisma.service'
import { StudentModule } from './student/student.module'

@Module({
	imports: [
		StudentModule,
		EmployeeModule,
		AuthModule,
		ConfigModule.forRoot(),
		EventModule,
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
