import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateLivroDto {
  @ApiProperty({ example: 'O Hobbit', required: false })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ example: 'J.R.R. Tolkien', required: false })
  @IsString()
  @IsOptional()
  autor?: string;

  @ApiProperty({ example: 'Aventura', required: false })
  @IsString()
  @IsOptional()
  genero?: string;

  @ApiProperty({ example: 1937, required: false })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  @IsOptional()
  anoPublicacao?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;
}
