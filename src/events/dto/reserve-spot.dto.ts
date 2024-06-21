import { TicketKind } from '@prisma/client';
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';

const ticket_types = [TicketKind.full, TicketKind.half];

export class ReserveSpotDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  spots: string[];

  @IsString()
  @IsNotEmpty()
  @IsIn(ticket_types)
  ticket_kind: TicketKind;
  email: string;
}
