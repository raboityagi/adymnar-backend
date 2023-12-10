import { faker } from "@faker-js/faker";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SchoolEmployee, Student } from "@prisma/client";
import { hash, verify } from "argon2";
import { PrismaService } from "src/prisma.service";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async loginStudent(dto: AuthDto) {
    const student = await this.validateStudent(dto);
    const tokens = await this.issueTokens(student.id);

    return {
      student: this.returnStudentFields(student),
      ...tokens,
    };
  }

  async loginEmployee(dto: AuthDto) {
    const employee = await this.validateEmployee(dto);
    const tokens = await this.issueTokens(employee.id);

    return {
      employee: this.returnEmployeeFields(employee),
      ...tokens,
    };
  }

  async findOne(id: number) {
    return await this.prisma.student.findUnique({
      where: {
        id,
      },
    });
  }

  async getNewTokensStudent(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException("Invalid refresh token");

    const student = await this.prisma.student.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = await this.issueTokens(student.id);

    return {
      student: this.returnStudentFields(student),
      ...tokens,
    };
  }
  async getNewTokensEmployee(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException("Invalid refresh token");

    const employee = await this.prisma.schoolEmployee.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = await this.issueTokens(employee.id);

    return {
      employee: this.returnEmployeeFields(employee),
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.prisma.student.findUnique({
      where: {
        login: dto.login,
      },
    });
    if (oldUser)
      throw new BadRequestException("User with this username already exists");

    const student = await this.prisma.student.create({
      data: {
        classId: 1,
        login: dto.login,
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        midname: "",
        avatarPath: faker.image.avatar(),
        password: await hash(dto.password),
      },
    });

    const tokens = await this.issueTokens(student.id);
    return {
      student: this.returnStudentFields(student),
      ...tokens,
    };
  }

  private async issueTokens(studentId: number) {
    const data = { id: studentId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: "45m",
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: "2d",
    });
    return { accessToken, refreshToken };
  }

  private returnStudentFields(student: Student) {
    return {
      id: student.id,
      login: student.login,
    };
  }

  private returnEmployeeFields(employee: SchoolEmployee) {
    return {
      id: employee.id,
      login: employee.login,
    };
  }
  private async validateStudent(dto: AuthDto) {
    const student = await this.prisma.student.findUnique({
      where: {
        login: dto.login,
      },
    });
    if (!student)
      throw new NotFoundException("User with this username already exists");
    const isValid = await verify(student.password, dto.password);
    if (!isValid) throw new UnauthorizedException("Invalid password");

    return student;
  }

  private async validateEmployee(dto: AuthDto) {
    const employee = await this.prisma.schoolEmployee.findUnique({
      where: {
        login: dto.login,
      },
    });
    if (!employee)
      throw new NotFoundException("User with this username already exists");
    const isValid = await verify(employee.password, dto.password);
    if (!isValid) throw new UnauthorizedException("Invalid password");

    return employee;
  }
}
