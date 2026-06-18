import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livro } from './livro.entity';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { PatchLivroDto } from './dto/patch-livro.dto';

@Injectable()
export class LivrosService {
  constructor(
    @InjectRepository(Livro)
    private readonly livroRepository: Repository<Livro>,
  ) {}

  findAll(): Promise<Livro[]> {
    return this.livroRepository.find();
  }

  async findOne(id: number): Promise<Livro> {
    const livro = await this.livroRepository.findOneBy({ id });
    if (!livro) throw new NotFoundException(`Livro #${id} não encontrado`);
    return livro;
  }

  create(dto: CreateLivroDto): Promise<Livro> {
    const livro = this.livroRepository.create(dto);
    return this.livroRepository.save(livro);
  }

  async update(id: number, dto: UpdateLivroDto): Promise<Livro> {
    const livro = await this.findOne(id);
    Object.assign(livro, dto);
    return this.livroRepository.save(livro);
  }

  async patch(id: number, dto: PatchLivroDto): Promise<Livro> {
    const livro = await this.findOne(id);
    livro.disponivel = dto.disponivel;
    return this.livroRepository.save(livro);
  }

  async remove(id: number): Promise<void> {
    const livro = await this.findOne(id);
    await this.livroRepository.remove(livro);
  }
}
