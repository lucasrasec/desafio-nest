import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  // @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  // @UseGuards(AuthGuard)
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  // @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @HttpCode(204)
  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/reserve')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  reserveSpots(@Body() dto: ReserveSpotDto, @Param('id') eventId: string) {
    return this.eventsService.reserveSpot({ ...dto, eventId });
  }
}
