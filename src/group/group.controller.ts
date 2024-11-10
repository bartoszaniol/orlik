import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GroupService } from './group.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { fullGroupSchema, errorSchema, groupSchema } from '../common/schemas';

@ApiTags('Groups')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by an id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the group object',
    schema: fullGroupSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
    schema: errorSchema,
  })
  getGroupById(@Param('id') id: string) {
    return this.groupService.getGroupById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Returns the group object',
    schema: fullGroupSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Could not create the group',
    schema: errorSchema,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
      },
    },
  })
  createGroup(@Body() createGroupDto: Prisma.GroupCreateInput) {
    return this.groupService.create(createGroupDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({
    status: 200,
    description: 'Returns the group object',
    schema: {
      type: 'object',
      properties: {
        ...groupSchema,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
    schema: errorSchema,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        invite_link: { type: 'string' },
      },
    },
  })
  updateGroup(
    @Body() updateGroupDto: Prisma.GroupUpdateInput,
    @Param('id') groupId: string,
  ) {
    return this.groupService.update(updateGroupDto, +groupId);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Group deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
    schema: errorSchema,
  })
  @ApiOperation({ summary: 'Delete a group' })
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }

  @Patch('user/:id')
  @ApiResponse({
    status: 200,
    description: 'Group updated',
    schema: fullGroupSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
    schema: errorSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: errorSchema,
  })
  @ApiOperation({ summary: 'Add user to a group' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
    },
  })
  addUserToGroup(
    @Param('id') groupId: string,
    @Body() userDto: { userId: number },
  ) {
    return this.groupService.addUserToGroup(+groupId, userDto);
  }

  @Patch('invite/:url')
  @HttpCode(201)
  @ApiOperation({ summary: 'Add user to a group by an invite link' })
  @ApiResponse({
    status: 201,
    description: 'Returns group object',
    schema: fullGroupSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid invite URL',
    schema: errorSchema,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
    },
  })
  addByInvite(
    @Param('url') inviteUrl: string,
    @Body() userDto: { userId: number },
  ) {
    return this.groupService.addByInvite(inviteUrl, userDto);
  }

  @Delete('user/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove user from a group' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
    },
  })
  deleteUserFromGroup(
    @Param('id') groupId: string,
    @Body() userDto: { userId: number },
  ) {
    return this.groupService.deleteUserFromGroup(+groupId, userDto.userId);
  }
}
