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
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

const errorSchema = {
  message: { type: 'string' },
  error: { type: 'string' },
  statusCode: { type: 'number' },
};

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
    telephone: { type: 'string' },
    groups: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          type: { type: 'string' },
          invite_link: { type: 'string' },
        },
      },
    },
  },
};

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        telephone: { type: 'string' },
        firebase_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns user object',
    schema: userSchema,
  })
  @ApiResponse({
    status: 409,
    description: 'Could not create user',
    schema: {
      type: 'object',

      properties: errorSchema,
    },
  })
  createUser(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns user object',
    schema: userSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: errorSchema,
    },
  })
  getUserData(@Param('id') id: string) {
    return this.userService.getUserData(+id);
  }

  @Get('/find/:name')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Returns array of users',
    schema: { type: 'array', items: userSchema },
  })
  @ApiOperation({ summary: 'Find user by name' })
  findUserByName(@Param('name') name: string) {
    return this.userService.findUserByName(name);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({
    status: 409,
    description: 'Could not update user',
    schema: {
      type: 'object',
      properties: errorSchema,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user object',
    schema: userSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Could not find user',
    schema: {
      type: 'object',
      properties: errorSchema,
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        telephone: { type: 'string' },
        firebase_token: { type: 'string' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 404,
    description: 'Could not find user',
    schema: {
      type: 'object',
      properties: errorSchema,
    },
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted',
  })
  @ApiResponse({
    status: 409,
    description: 'Could not delete user',
    schema: {
      type: 'object',
      properties: errorSchema,
    },
  })
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    this.userService.remove(+id);
  }

  @Get('/groups/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 404,
    description: 'Could not find user',
    schema: {
      type: 'object',
      properties: errorSchema,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns array of groups',
    schema: userSchema.properties.groups,
  })
  @ApiOperation({ summary: "Find user's groups" })
  getUserGroups(@Param('id') id: string) {
    return this.userService.getUserGroups(+id);
  }
}
