import {
  NotFoundException,
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly userService: DatabaseService) {}

  async createUser(createUserDto: Prisma.UserCreateInput) {
    try {
      const newUser = await this.userService.user.create({
        data: createUserDto,
      });
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      throw new ConflictException('Could not create user');
    }
  }

  async getUserData(id: number) {
    const user = await this.userService.user.findUnique({
      omit: { firebase_token: true },
      where: { id },
      include: { groups: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserGroups(id: number) {
    await this.getUserData(id);
    const usersgroups = await this.userService.user.findUnique({
      where: { id },
      select: { groups: true },
    });
    return usersgroups.groups;
  }

  async findUserByName(name: string) {
    return await this.userService.user.findMany({
      where: { username: { contains: name } },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    await this.getUserData(id);
    try {
      const updateUser = await this.userService.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updateUser;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid data');
      }
      throw new ConflictException('Could not update user');
    }
  }

  // TODO: GOWNO NIE DZIALA dla nieistniejacego usera
  async remove(id: number) {
    await this.getUserData(id);
    await this.userService.user.delete({ where: { id } });
  }
}
