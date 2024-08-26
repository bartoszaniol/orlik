import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GroupService {
  constructor(private readonly groupService: DatabaseService) {}

  async create(createGroupDto: Prisma.GroupCreateInput) {
    return await this.groupService.group.create({ data: createGroupDto });
  }

  async remove(id: number) {
    return await this.groupService.group.delete({ where: { id } });
  }

  async addUserToGroup(groupId: number, groupDTO: { userId: number }) {
    return await this.groupService.group.update({
      where: { id: groupId },
      data: { members: { connect: { id: groupDTO.userId } } },
    });
  }

  async getGroupById(id: number) {
    return await this.groupService.group.findFirst({
      where: { id },
      include: { members: true },
    });
  }
}
