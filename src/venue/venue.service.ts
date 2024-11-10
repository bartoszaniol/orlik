import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class VenueService {
  constructor(private readonly venueService: DatabaseService) {}

  async create(createVenueDto: Prisma.VenueCreateInput) {
    try {
      return await this.venueService.venue.create({ data: createVenueDto });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new ConflictException('Invalid data');
      }
      throw new ConflictException('Could not create group');
    }
  }

  async findVenueById(id: number) {
    const venueData = await this.venueService.venue.findUnique({
      where: { id },
    });
    if (!venueData) {
      throw new NotFoundException('Venue not found');
    }
    return venueData;
  }

  async update(id: number, updateVenueDto: Prisma.VenueUpdateInput) {
    await this.findVenueById(id);
    try {
      return await this.venueService.venue.update({
        where: { id },
        data: updateVenueDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid data');
      }
      throw new ConflictException('Could not update venue');
    }
  }

  async remove(id: number) {
    await this.findVenueById(id);
    await this.venueService.venue.delete({ where: { id } });
  }
}
