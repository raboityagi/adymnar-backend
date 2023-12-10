import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
<<<<<<< HEAD
import { EventModule } from './event/event.module';

@Module({
  imports: [AuthModule,ConfigModule.forRoot(), EventModule],
=======
import { StudentModule } from './student/student.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [AuthModule,ConfigModule.forRoot(), StudentModule, EmployeeModule],
>>>>>>> f21ec848fef8cbd41a05558ec1ea780aed35e2cb
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
