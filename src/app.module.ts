import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [AuthModule,ConfigModule.forRoot(), StudentModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
