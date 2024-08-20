import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class VenueService {
constructor(private readonly venueService: DatabaseService){}

  async create(createVenueDto: Prisma.VenueCreateInput) {
    return await this.venueService.venue.create({data: createVenueDto})
  }

  async findOne(id: number) {
    return await this.venueService.venue.findUnique({where:{id}})
  }

  async update(id: number, updateVenueDto: Prisma.VenueUpdateInput) {
    return await this.venueService.venue.update({where:{id},data: updateVenueDto})
  }

  async remove(id: number) {
    return await this.venueService.venue.delete({where:{id}})
  }
}
