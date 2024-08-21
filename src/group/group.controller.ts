import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  createGroup(@Body() createGroupDto: Prisma.GroupCreateInput) {
    return this.groupService.create(createGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }

  @Patch(':id')
  addUserToGroup(
    @Param('id') groupId: string,
    @Body() addUserToGroupDTO: number,
  ) {
    return this.groupService.addUserToGroup(+groupId, addUserToGroupDTO);
  }
}
