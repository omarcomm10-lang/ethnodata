import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'OMZO Alpha' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'alpha@test.com' })
  @IsEmail()
  email!: string;
}
