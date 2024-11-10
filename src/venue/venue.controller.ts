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
import { VenueService } from './venue.service';
import { Prisma } from '@prisma/client';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { errorSchema, venueSchema } from '../common/schemas';

@ApiTags('Venues')
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  @ApiOperation({ summary: 'Create new venue' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        mail: { type: 'string' },
        logo: { type: 'string' },
        address: { type: 'string' },
        type: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the venue object',
    schema: {
      type: 'object',
      properties: {
        ...venueSchema,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Could not create the venue',
    schema: errorSchema,
  })
  create(@Body() createVenueDto: Prisma.VenueCreateInput) {
    return this.venueService.create(createVenueDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'Returns the venue object',
    schema: {
      type: 'object',
      properties: {
        ...venueSchema,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Could not find the venue',
    schema: errorSchema,
  })
  @ApiOperation({ summary: 'Find venue by id' })
  findVenueById(@Param('id') id: string) {
    return this.venueService.findVenueById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update venue' })
  @ApiResponse({
    status: 201,
    description: 'Returns the venue object',
    schema: {
      type: 'object',
      properties: {
        ...venueSchema,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Could not update the venue',
    schema: errorSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Could not find the venue',
    schema: errorSchema,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        mail: { type: 'string' },
        logo: { type: 'string' },
        address: { type: 'string' },
        type: { type: 'string' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateVenueDto: Prisma.VenueUpdateInput,
  ) {
    return this.venueService.update(+id, updateVenueDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
    schema: errorSchema,
  })
  @ApiOperation({ summary: 'Remove venue' })
  remove(@Param('id') id: string) {
    return this.venueService.remove(+id);
  }

  // Get Typy (boisko, hala, siłka, etc)
}
