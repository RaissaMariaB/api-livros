import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PatchLivroDto {
  @ApiProperty({ example: false, description: 'Atualiza apenas a disponibilidade do livro' })
  @IsBoolean()
  disponivel: boolean;
}
