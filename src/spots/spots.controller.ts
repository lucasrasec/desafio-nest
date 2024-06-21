import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotsService } from './spots.service';
import { CreateSpotDto } from './dto/create-spot.dto';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  // @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  create(
    @Body() createSpotDto: CreateSpotDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({ ...createSpotDto, eventId });
  }

  @Get()
  // @UseGuards(AuthGuard)
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  // @UseGuards(AuthGuard)
  findOne(@Param('id') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  // @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  update(
    @Param('id') spotId: string,
    @Body() updateSpotDto: UpdateSpotDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.update(eventId, spotId, updateSpotDto);
  }

  @Delete(':spotId')
  // @UseGuards(AuthGuard)
  remove(@Param('id') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(eventId, spotId);
  }
}
