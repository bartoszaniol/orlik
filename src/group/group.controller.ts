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

  @Get(':id')
  getGroupById(@Param('id') id: string) {
    return this.groupService.getGroupById(+id);
  }

  @Post()
  createGroup(@Body() createGroupDto: Prisma.GroupCreateInput) {
    const length = 22;
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    createGroupDto.invite_link = result;
    return this.groupService.create(createGroupDto);
  }

  @Patch(':id')
  updateGroup(
    @Body() updateGroupDto: Prisma.GroupUpdateInput,
    @Param('id') groupId: string,
  ) {
    return this.groupService.update(updateGroupDto, +groupId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }

  @Patch('user/:id')
  addUserToGroup(
    @Param('id') groupId: string,
    @Body() userDto: { userId: number },
  ) {
    return this.groupService.addUserToGroup(+groupId, userDto);
  }

  @Post('invite/:url')
  addByInvite(
    @Param('url') inviteUrl: string,
    @Body() userDto: { userId: number },
  ) {
    return this.groupService.addByInvite(inviteUrl, userDto);
  }
}
