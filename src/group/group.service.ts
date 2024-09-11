import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GroupService {
  constructor(private readonly groupService: DatabaseService) {}

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
    return await this.groupService.group.create({ data: createGroupDto });
  }

  async addByInvite(inviteUrl: string, userDto: { userId: number }) {
    const validUrl = await this.groupService.group.findFirst({
      where: { invite_link: inviteUrl },
    });
    if (!validUrl || Object.keys(validUrl).length == 0) {
      throw new NotFoundException('Invalid invite URL');
    } else {
      await this.addUserToGroup(validUrl.id, userDto);
      return validUrl;
    }
  }

  async update(updateGroupDto: Prisma.GroupUpdateInput, groupId: number) {
    return await this.groupService.group.update({
      where: { id: groupId },
      data: updateGroupDto,
    });
  }

  async remove(id: number) {
    return await this.groupService.group.delete({ where: { id } });
  }

  async addUserToGroup(groupId: number, userDto: { userId: number }) {
    return await this.groupService.group.update({
      where: { id: groupId },
      data: { members: { connect: { id: userDto.userId } } },
    });
  }

  async getGroupById(id: number) {
    return await this.groupService.group.findFirst({
      where: { id },
      include: { members: true },
    });
  }
}
