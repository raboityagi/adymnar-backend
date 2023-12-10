import { Controller, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentStudent } from 'src/auth/decorators/student.decorator';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @Get('profile')
  @Auth()
  async getProfile(@CurrentStudent('id') id:number){
    return this.employeeService.byId(id)
  }
}
