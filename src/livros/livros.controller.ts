import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LivrosService } from './livros.service';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { PatchLivroDto } from './dto/patch-livro.dto';
import { Livro } from './livro.entity';

@ApiTags('Livros')
@Controller('livros')
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os livros' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso', type: [Livro] })
  findAll(): Promise<Livro[]> {
    return this.livrosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar livro por ID' })
  @ApiResponse({ status: 200, description: 'Livro encontrado', type: Livro })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Livro> {
    return this.livrosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo livro' })
  @ApiResponse({ status: 201, description: 'Livro criado com sucesso', type: Livro })
  create(@Body() dto: CreateLivroDto): Promise<Livro> {
    return this.livrosService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Substituir completamente um livro' })
  @ApiResponse({ status: 200, description: 'Livro atualizado', type: Livro })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLivroDto,
  ): Promise<Livro> {
    return this.livrosService.update(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar disponibilidade do livro' })
  @ApiResponse({ status: 200, description: 'Disponibilidade atualizada', type: Livro })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchLivroDto,
  ): Promise<Livro> {
    return this.livrosService.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover um livro' })
  @ApiResponse({ status: 204, description: 'Livro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.livrosService.remove(id);
  }
}
