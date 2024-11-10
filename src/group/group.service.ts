import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from '../user/user.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  async create(createGroupDto: Prisma.GroupCreateInput) {
    const createUniqueUrl = () => {
      const length = 22;
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
        counter += 1;
      }
      return result;
    };
    const uniqueUrl = createUniqueUrl();
    let unique = false;
    while (!unique) {
      const isUnique = await this.groupService.group.findUnique({
        where: { invite_link: uniqueUrl },
      });
      if (!isUnique) {
        unique = true;
      }
    }
    createGroupDto.invite_link = uniqueUrl;
    try {
      return await this.groupService.group.create({ data: createGroupDto });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid data');
      }
      throw new ConflictException('Could not create group');
    }
  }

  async update(updateGroupDto: Prisma.GroupUpdateInput, groupId: number) {
    await this.getGroupById(groupId);
    try {
      await this.groupService.group.update({
        where: { id: groupId },
        data: updateGroupDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid data');
      }
      throw new ConflictException('Could not update user');
    }
  }

  async remove(id: number) {
    await this.getGroupById(id);
    await this.groupService.group.delete({ where: { id } });
  }

  async addByInvite(inviteUrl: string, userDto: { userId: number }) {
    const validUrl = await this.groupService.group.findFirst({
      where: { invite_link: inviteUrl },
    });
    if (!validUrl || Object.keys(validUrl).length == 0) {
      throw new NotFoundException('Invalid invite URL');
    }
    const foundUser = await this.userService.getUserData(userDto.userId);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    const userInGroup = foundUser.groups.find(
      (group) => group.id === validUrl.id,
    );
    if (userInGroup) {
      throw new ConflictException('User already in group');
    }
    await this.addUserToGroup(validUrl.id, userDto, true);
  }

  async addUserToGroup(
    groupId: number,
    userDto: { userId: number },
    byUrl = false,
  ) {
    if (!byUrl) {
      const userData = await this.userService.getUserData(userDto.userId);

      const groupData = await this.getGroupById(groupId);
      if (userData.groups.find((group) => group.id === groupId)) {
        throw new ConflictException('User already in group');
      }
      if (!groupData) {
        throw new NotFoundException('Group not found');
      }
    }
    try {
      return await this.groupService.group.update({
        where: { id: groupId },
        data: { members: { connect: { id: userDto.userId } } },
        include: { members: true },
      });
    } catch (error) {
      {
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data');
        }
        throw new ConflictException('Could not update user');
      }
    }
  }

  async getGroupById(id: number) {
    const foundGroup = await this.groupService.group.findFirst({
      where: { id },
      include: { members: true },
    });
    if (!foundGroup) {
      throw new NotFoundException('Group not found');
    }
    return foundGroup;
  }

  async deleteUserFromGroup(groupId: number, userId: number) {
    const groupData = await this.getGroupById(groupId);
    if (!groupData.members.find((member) => member.id === userId)) {
      throw new NotFoundException('User not in group');
    }
    try {
      await this.groupService.group.update({
        where: { id: groupId },
        data: { members: { disconnect: { id: userId } } },
        include: { members: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new ConflictException('Invalid data');
      }
      throw new ConflictException('Could not delete user');
    }
  }
}
