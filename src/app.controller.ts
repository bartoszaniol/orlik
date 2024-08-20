import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(AuthGuard('firebase-auth'))
  getProtected(@Request() req) {
    return req.user;
  }

  @Get()
  getAll(){
    return "HELLO WORLD"
  }
}

