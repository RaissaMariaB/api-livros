import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateLivroDto {
  @ApiProperty({ example: 'O Senhor dos Anéis' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsString()
  @IsNotEmpty()
  autor: string;

  @ApiProperty({ example: 'Fantasia' })
  @IsString()
  @IsNotEmpty()
  genero: string;

  @ApiProperty({ example: 1954 })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  anoPublicacao: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  disponivel?: boolean;
}
