import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService){}
    async byId(id:number)
    {
        const student = await this.prisma.student.findUnique({
            where:{
                id
            },
            select:{
                id: true,
                login: true,
                name: true,
                surname: true,
                midname: true,
            }
        })

        if(!student){
            throw new NotFoundException("User not found")
        }
        return student
    }
}
