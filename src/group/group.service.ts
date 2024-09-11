import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GroupService {
  constructor(private readonly groupService: DatabaseService) {}

  async create(createGroupDto: Prisma.GroupCreateInput) {
    return await this.groupService.group.create({ data: createGroupDto });
  }

  async addByInvite(inviteUrl: string, userId: number) {
    const validUrl = await this.groupService.group.findFirst({
      where: { invite_link: inviteUrl },
    });
    if (!validUrl || Object.keys(validUrl).length == 0) {
      throw new NotFoundException('Invalid invite URL');
    } else {
      await this.addUserToGroup(validUrl.id, userId);
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

  async addUserToGroup(groupId: number, userId: number) {
    return await this.groupService.group.update({
      where: { id: groupId },
      data: { members: { connect: { id: userId } } },
    });
  }

  async getGroupById(id: number) {
    return await this.groupService.group.findFirst({
      where: { id },
      include: { members: true },
    });
  }
}
