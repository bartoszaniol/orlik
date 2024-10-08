import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly userService: DatabaseService) {}

  async createUser(createUserDto: Prisma.UserCreateInput) {
    return await this.userService.user.create({ data: createUserDto });
  }

  async getUserData(id: number) {
    return await this.userService.user.findUnique({
      omit: { firebase_token: true },
      where: { id },
      include: { groups: true },
    });
  }

  async getUserGroups(id: number) {
    return await this.userService.user.findUnique({
      where: { id },
      select: { groups: true },
    });
  }

  async findUserByName(name: string) {
    return await this.userService.user.findMany({
      where: { username: { contains: name } },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return await this.userService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.userService.user.delete({ where: { id } });
  }
}
