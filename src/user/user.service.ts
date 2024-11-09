import {
  NotFoundException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    try {
      await this.getUserData(id);
      const updateUser = await this.userService.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updateUser;
    } catch (error) {
      if (error.response?.statusCode === 404) {
        throw new NotFoundException('User not found');
      } else {
        throw new ConflictException('Could not update user');
      }
    }
  }

  // TODO: GOWNO NIE DZIALA dla nie istniejacego usera
  async remove(id: number) {
    try {
      await this.getUserData(id);
      await this.userService.user.delete({ where: { id } });
    } catch (error) {
      if (error.response?.statusCode === 404) {
        throw new NotFoundException('User not found');
      } else {
        throw new ConflictException('Could not update user');
      }
    }
  }
}
