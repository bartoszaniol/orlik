import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Test')
export class AppController {
  @Get('protected')
  @UseGuards(AuthGuard('firebase-auth'))
  getProtected(@Request() req) {
    return req.user;
  }
}
