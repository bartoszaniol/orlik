import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VenueModule } from './venue/venue.module';
import { GroupService } from './group/group.service';
import { GroupModule } from './group/group.module';

@Module({
  imports: [AuthModule, UserModule, VenueModule, GroupModule],
  controllers: [AppController],
  providers: [AppService, FirebaseService, GroupService],
})
export class AppModule {}
