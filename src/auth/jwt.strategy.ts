import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { SchoolEmployee, Student } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, 
    private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate_student({id}:Pick<Student,'id'>) {
    return this.prisma.student.findUnique({where:{id:+id}})
  }
  async validate_employee({id}:Pick<SchoolEmployee,'id'>) {
    return this.prisma.student.findUnique({where: {id: +id}})
  }
}