import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('livros')
export class Livro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  autor: string;

  @Column()
  genero: string;

  @Column()
  anoPublicacao: number;

  @Column({ default: true })
  disponivel: boolean;

  @CreateDateColumn()
  criadoEm: Date;
}
