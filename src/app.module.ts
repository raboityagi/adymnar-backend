import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';

@Module({
  imports: [AuthModule,ConfigModule.forRoot(), EventModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
