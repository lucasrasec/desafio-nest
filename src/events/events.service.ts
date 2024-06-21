import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}
  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: { ...createEventDto, date: new Date(createEventDto.date) },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      data: { ...updateEventDto, date: new Date(updateEventDto.date) },
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    });
  }

  async reserveSpot(reserveDto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: reserveDto.eventId,
        name: {
          in: reserveDto.spots,
        },
      },
    });

    const foundSpotsName = spots.map((spot) => spot.name);

    if (spots.length !== reserveDto.spots.length) {
      const notFoundSpots = reserveDto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new NotFoundException({
        statusCode: 404,
        message: `Spots not exists: ${notFoundSpots.join(', ')}`,
      });
    }

    const reservedSpots = await this.prismaService.spot.findMany({
      where: {
        eventId: reserveDto.eventId,
        name: {
          in: reserveDto.spots,
        },
        status: SpotStatus.reserved,
      },
    });

    if (reservedSpots.length > 0) {
      const reservedNames = reservedSpots.map((spot) => spot.name);
      throw new BadRequestException({
        status: 400,
        message: `Spots ${reservedNames.join(', ')} is not available for reservation`,
      });
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: reserveDto.ticket_kind,
              email: reserveDto.email,
              status: TicketStatus.reserved,
            })),
          });

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: reserveDto.ticket_kind,
                  email: reserveDto.email,
                },
              }),
            ),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return tickets;
    } catch (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: error.message,
      });
    }
  }
}
