import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateSpotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^[A-Za-z].*\d$/, {
    message: 'Name must start with a letter and end with a number',
  })
  name: string;
}
