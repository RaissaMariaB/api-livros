import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livro } from './livros/livro.entity';
import { LivrosModule } from './livros/livros.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'banco.sqlite',
      entities: [Livro],
      synchronize: true,
      logging: true,
    }),
    LivrosModule,
  ],
})
export class AppModule {}
