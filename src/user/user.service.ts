import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly userService: DatabaseService){}

  async getUserData(id: number) {
    return await this.userService.user.findUnique({omit:{firebase_token:true},where: {id}})
  }

  async findUserByName(name: string){
    return await this.userService.user.findMany({where:{username:{contains:name}}})
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return await this.userService.user.update({where:{id},data:updateUserDto})
  }

  async remove(id: number) {
    return await this.userService.user.delete({where:{id}})
  }
}
