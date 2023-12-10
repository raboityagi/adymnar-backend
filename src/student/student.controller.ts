import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentStudent } from 'src/auth/decorators/student.decorator';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentStudent('id') id:number){
    return this.studentService.byId(id)
  }
}
